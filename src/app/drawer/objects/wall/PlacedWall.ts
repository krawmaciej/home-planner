import {Group, Line, LineBasicMaterial, Scene, Vector3} from "three";
import {AdjacentObject} from "../../components/CollisionDetector";
import {WallConstruction} from "../../components/DrawerMath";
import {ObjectPoints, ObjectSideOrientation} from "../../constants/Types";
import {ISceneObject} from "../ISceneObject";
import {WallSides} from "./WallSides";
import {IWallComponent} from "../window/IWallComponent";
import {Direction} from "./Direction";

export class PlacedWall implements ISceneObject {
    
    private static readonly material = new LineBasicMaterial({
        color: 0x000000,
    });

    public static create(props: WallConstruction, adjacentWalls: AdjacentObject<PlacedWall>[]): PlacedWall {
        const wallSides = new WallSides(props);
        adjacentWalls.forEach(aw => wallSides.putHole(aw.toSide, aw.points));
        const wallParts = wallSides.createDrawableObjects(PlacedWall.material);
        const wall = new Group();
        wallParts.forEach(wp => wall.add(wp));
        return new PlacedWall(props, wallSides, wallParts, wall);
    }

    public readonly props: WallConstruction;
    public readonly wallSides: WallSides; // used in updating, adding new cut blocks
    public readonly lines: Array<Line>;
    public readonly wall: Group;

    private constructor(props: WallConstruction, wallSides: WallSides, lines: Array<Line>, wall: Group) {
        this.props = props;
        this.wallSides = wallSides;
        this.lines = lines;
        this.wall = wall;
    }

    /**
     * Returns new wall with collisions applied. Breaks old {@link this.wallSides}.
     * @param toSide side of the wall that collided
     * @param points points of collision
     */
    public collidedWithWall(toSide: ObjectSideOrientation, points: Vector3[]): PlacedWall {
        this.wallSides.putHole(toSide, points);
        const wallParts = this.wallSides.createDrawableObjects(PlacedWall.material);
        const wall = new Group();
        wallParts.forEach(wp => wall.add(wp));
        return new PlacedWall(this.props, this.wallSides, wallParts, wall);
    }

    public addTo(scene: Scene): void {
        scene.add(this.wall);
    }

    public removeFrom(scene: Scene): void {
        this.lines.forEach(line => line.geometry.dispose());
        scene.remove(this.wall);
    }

    public getObjectPointsOnScene(): ObjectPoints {
        return this.props.points;
    }

    public addComponent(component: IWallComponent): void {
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
    public removeComponent(component: IWallComponent): void {
        if (this.props.direction === Direction.DOWN || this.props.direction === Direction.UP) {
            this.wallSides.removeComponent(ObjectSideOrientation.LEFT, component);
            this.wallSides.removeComponent(ObjectSideOrientation.RIGHT, component);
        } else {
            this.wallSides.removeComponent(ObjectSideOrientation.TOP, component);
            this.wallSides.removeComponent(ObjectSideOrientation.BOTTOM, component);
        }
    }
}
