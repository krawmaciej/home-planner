import {Group, Line, LineBasicMaterial, Scene, Vector3} from "three";
import {AdjacentWall} from "../../components/CollisionDetector";
import {WallConstruction} from "../../components/DrawerMath";
import {ObjectPoints} from "../../constants/Types";
import {ISceneObject} from "../ISceneObject";
import {WallSides, WallSideType} from "./WallSides";
import {IWallComponent} from "../window/IWallComponent";
import {Direction} from "./Direction";

export class PlacedWall implements ISceneObject {
    
    private static readonly material = new LineBasicMaterial({
        color: 0x000000,
        // depthTest: false
    });

    public static create(props: WallConstruction, adjacentWalls: AdjacentWall[]): PlacedWall {
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
    public collidedWithWall(toSide: WallSideType, points: Vector3[]): PlacedWall {
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
        scene.remove(this.wall);
    }

    public objectPointsOnScene(): ObjectPoints {
        return this.props.points;
    }

    public addComponent(component: IWallComponent): void {
        if (this.props.direction === Direction.UP || this.props.direction === Direction.DOWN) {
            this.wallSides.addComponent(WallSideType.LEFT, component);
            this.wallSides.addComponent(WallSideType.RIGHT, component);
        } else {
            this.wallSides.addComponent(WallSideType.BOTTOM, component);
            this.wallSides.addComponent(WallSideType.TOP, component);
        }
    }

    /**
     * Throws error if component does not belong to this wall.
     * @param component
     */
    public removeComponent(component: IWallComponent): void {
        if (this.props.direction === Direction.UP || this.props.direction === Direction.DOWN) {
            this.wallSides.removeComponent(WallSideType.LEFT, component);
            this.wallSides.removeComponent(WallSideType.RIGHT, component);
        } else {
            this.wallSides.removeComponent(WallSideType.BOTTOM, component);
            this.wallSides.removeComponent(WallSideType.TOP, component);
        }
    }
}
