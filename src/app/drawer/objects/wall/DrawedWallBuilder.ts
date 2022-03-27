import { Vector3 } from "three";
import { Collision } from "../../components/CollisionDetector";
import DrawerMath, { WallConstruction } from "../../components/DrawerMath";
import DrawedWall from "./DrawedWall";
import WallThickness from "./WallThickness";

/**
 * Creates a wall properties from which the meshes will be created.
 * Used for collision detection and calculations which do not require meshes.
 */
export default class DrawedWallBuilder {

    private props: WallConstruction;
    private isCollided: boolean = false;
    private contactPoints: Vector3[] = [];

    public constructor(props: WallConstruction) {
        this.props = props;
    }
    
    public static createWall(start: Vector3, end: Vector3, wallThickness: WallThickness): DrawedWallBuilder {
        const wallPoints = DrawerMath.calculateWallPoints(start, end, wallThickness);
        return new DrawedWallBuilder(wallPoints);
        // might create 4 sides here
        // IMPORTANT: sides will have their own manipulation logic called from wall when there's collision
        // return created wall with direction and 4 corner points
    }

    public changeProps(props: WallConstruction): DrawedWallBuilder {
        this.props = props;
        return this;
    }

    public setCollided(collision: Collision): DrawedWallBuilder {
        this.isCollided = collision.isCollision;
        this.contactPoints = collision.adjecentWalls.flatMap(wall => wall.points);
        return this;
    }

    public build(): DrawedWall {
        return DrawedWall.wallFromPoints(this.props, this.isCollided, this.contactPoints);
    }

    // getters
    public getProps(): WallConstruction {
        return this.props;
    }
}
