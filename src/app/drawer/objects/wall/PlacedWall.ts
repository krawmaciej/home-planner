import {
    BufferGeometry,
    CircleGeometry,
    Group,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    Scene,
} from "three";
import {AdjacentWallProps, WallConstruction} from "../../components/DrawerMath";
import {HIGHLIGHTED_COLOR, ObjectPoints, ObjectSideOrientation} from "../../constants/Types";
import {ISceneObject} from "../ISceneObject";
import {WallSides} from "./WallSides";
import {Direction} from "./Direction";
import {IPlacedWallComponent} from "../component/IPlacedWallComponent";
import {WallBuilder} from "./WallBuilder";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {createWallConstructionLabel} from "../../components/Labels";
import {IObjectPointsOnScene} from "../IObjectPointsOnScene";
import {CommonMathOperations} from "../../../common/components/CommonMathOperations";

export class PlacedWall implements ISceneObject, IObjectPointsOnScene {
    
    private static readonly MATERIAL = new LineBasicMaterial({
        color: 0x000000,
    });

    private static readonly MIDDLE_MATERIAL = new LineBasicMaterial({
        color: 0x666666,
    });

    private static readonly HIGHLIGHTED_MATERIAL = new LineBasicMaterial({
        color: HIGHLIGHTED_COLOR,
    });

    public static create(props: WallConstruction, adjacentWalls: Array<AdjacentWallProps>): PlacedWall {
        const wallSides = new WallSides(props);
        adjacentWalls.forEach(aw => wallSides.putHole(aw.toSide, aw.points));
        const wallParts = wallSides.createDrawableObjects(PlacedWall.MATERIAL);
        const wall = new Group();
        wallParts.forEach(wp => wall.add(wp));

        const middleGeometry = new BufferGeometry().setFromPoints([props.middlePoints.first, props.middlePoints.last]);
        const middle = new Line(middleGeometry, PlacedWall.MIDDLE_MATERIAL);
        const p1 = WallBuilder.createMiddlePoint(props.middlePoints.last);
        const p2 = WallBuilder.createMiddlePoint(props.middlePoints.first);
        return new PlacedWall(props, adjacentWalls, wallSides, wallParts, wall, middle, p1, p2, new Array<IPlacedWallComponent>());
    }

    public readonly props: WallConstruction;
    public readonly adjacentWallPropsList: Array<AdjacentWallProps>;

    public readonly wallSides: WallSides; // used in updating, adding new cut blocks and components
    public readonly wallComponents: Array<IPlacedWallComponent>; // used to quickly find all wall's components
    public readonly lines: Array<Line>;
    public readonly wall: Group;
    public readonly middle: Line<BufferGeometry>;
    public readonly anchorStart: Mesh<CircleGeometry, MeshBasicMaterial>;
    public readonly anchorEnd: Mesh<CircleGeometry, MeshBasicMaterial>;
    private readonly label: CSS2DObject;

    private constructor(
        props: WallConstruction,
        adjacentWallPropsList: Array<AdjacentWallProps>,
        wallSides: WallSides,
        lines: Array<Line>,
        wall: Group,
        middle: Line<BufferGeometry>,
        anchorStart: Mesh<CircleGeometry, MeshBasicMaterial>,
        anchorEnd: Mesh<CircleGeometry, MeshBasicMaterial>,
        components: Array<IPlacedWallComponent>
    ) {
        this.props = props;
        this.adjacentWallPropsList = adjacentWallPropsList;
        this.wallSides = wallSides;
        this.lines = lines;
        this.wall = wall;
        this.middle = middle;
        this.anchorStart = anchorStart;
        this.anchorEnd = anchorEnd;
        this.wallComponents = components;
        const css2DObject = new CSS2DObject(createWallConstructionLabel(this.props.width));
        const middleVector = props.middlePoints.first.clone().add(props.middlePoints.last).multiplyScalar(0.5);
        css2DObject.position.x = middleVector.x;
        css2DObject.position.z = middleVector.z;
        this.label = css2DObject;
        middle.add(anchorStart);
        middle.add(anchorEnd);
        wall.add(middle);
    }

    /**
     * Returns new wall with collisions applied. Breaks old {@link this.wallSides}.
     * @param adjacentWallProps
     */
    public collidedWithWall(adjacentWallProps: AdjacentWallProps): PlacedWall {
        const wallComponentsToReAdd = [...this.wallComponents];
        wallComponentsToReAdd.forEach(component => this.removeComponent(component));
        this.wallSides.putHole(adjacentWallProps.toSide, adjacentWallProps.points);
        wallComponentsToReAdd.forEach(component => this.addComponent(component));

        const newAdjacentWallList = [...this.adjacentWallPropsList, adjacentWallProps];
        const wallParts = this.wallSides.createDrawableObjects(PlacedWall.MATERIAL);
        const wall = new Group();
        wallParts.forEach(wp => wall.add(wp));
        return new PlacedWall(
            this.props,
            newAdjacentWallList,
            this.wallSides,
            wallParts,
            wall,
            this.middle,
            this.anchorStart,
            this.anchorEnd,
            wallComponentsToReAdd,
        );
    }

    public unCollideWithWall(adjacentWallProps: AdjacentWallProps): PlacedWall {
        const wallComponentsToReAdd = [...this.wallComponents];
        wallComponentsToReAdd.forEach(component => this.removeComponent(component));
        this.wallSides.fillHole(adjacentWallProps.toSide, adjacentWallProps.points);
        wallComponentsToReAdd.forEach(component => this.addComponent(component));

        const previousSize = this.adjacentWallPropsList.length;
        const newAdjacentWallList = this.skipAdjacentWallProps(adjacentWallProps);
        if (newAdjacentWallList.length !== (previousSize - 1)) {
            throw new Error(`Didn't skip ${JSON.stringify(adjacentWallProps)}
                from list: ${JSON.stringify(this.adjacentWallPropsList)}`);
        }

        const wallParts = this.wallSides.createDrawableObjects(PlacedWall.MATERIAL);
        const wall = new Group();
        wallParts.forEach(wp => wall.add(wp));
        return new PlacedWall(
            this.props,
            newAdjacentWallList,
            this.wallSides,
            wallParts,
            wall,
            this.middle,
            this.anchorStart,
            this.anchorEnd,
            wallComponentsToReAdd,
        );
    }

    public addTo(scene: Scene): void {
        this.addLabel(); // re-add label to wall
        scene.add(this.wall);
    }

    public removeFrom(scene: Scene): void {
        this.removeLabel(); // removing object from scene doesn't remove label
        this.lines.forEach(line => line.geometry.dispose());
        scene.remove(this.wall);
    }

    public getObjectPointsOnScene(): ObjectPoints {
        return this.props.points;
    }

    public addComponent(component: IPlacedWallComponent): void {
        this.wallComponents.push(component);
        if (this.props.direction === Direction.DOWN || this.props.direction === Direction.UP) {
            this.wallSides.addComponent(ObjectSideOrientation.LEFT, component);
            this.wallSides.addComponent(ObjectSideOrientation.RIGHT, component);
        } else {
            this.wallSides.addComponent(ObjectSideOrientation.TOP, component);
            this.wallSides.addComponent(ObjectSideOrientation.BOTTOM, component);
        }
    }

    /**
     * Throws error if component does not belong to this wall.
     * @param component
     */
    public removeComponent(component: IPlacedWallComponent): void {
        const index = this.wallComponents.indexOf(component);
        if (index !== -1) {
            this.wallComponents.splice(index, 1);
        }

        if (this.props.direction === Direction.DOWN || this.props.direction === Direction.UP) {
            this.wallSides.removeComponent(ObjectSideOrientation.LEFT, component);
            this.wallSides.removeComponent(ObjectSideOrientation.RIGHT, component);
        } else {
            this.wallSides.removeComponent(ObjectSideOrientation.TOP, component);
            this.wallSides.removeComponent(ObjectSideOrientation.BOTTOM, component);
        }
    }

    /**
     * Returns width of this wall.
     */
    public getWidth(): number {
        return this.props.width;
    }

    public addLabel(): void {
        this.wall.add(this.label);
    }

    public removeLabel(): void {
        this.wall.remove(this.label);
    }

    public highlight(): void {
    }

    public unHighlight(): void {
    }

    private skipAdjacentWallProps(toSkip: AdjacentWallProps): Array<AdjacentWallProps> {
        return this.adjacentWallPropsList.filter(awp => {
            if (awp.toSide !== toSkip.toSide) {
                return true; // don't skip
            }
            if (awp.points.length !== toSkip.points.length) {
                return true; // don't skip
            }
            for (let i = 0; i < awp.points.length; i++) {
                if (!CommonMathOperations.areVectors3Equal(awp.points[i], toSkip.points[i])) {
                    return true; // don't skip
                }
            }
            return false;
        });
    }
}
