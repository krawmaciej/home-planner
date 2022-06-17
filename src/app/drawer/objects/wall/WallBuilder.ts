import { Vector3 } from "three";
import { AdjacentObject, Collision } from "../../components/CollisionDetector";
import { DrawerMath, WallConstruction } from "../../components/DrawerMath";
import { DrawnWall } from "./DrawnWall";
import { PlacedWall } from "./PlacedWall";
import { WallThickness } from "./WallThickness";

/**
 * Creates a wall properties from which the meshes will be created.
 * Used for collision detection and calculations which do not require meshes.
 */
export class WallBuilder {

    private props: WallConstruction;
    private collision: Collision<PlacedWall>;

    public constructor(props: WallConstruction) {
        this.props = props;
        this.collision = { isCollision: false, adjacentObjects: new Array<AdjacentObject<PlacedWall>>() };
    }
    
    public static createWall(start: Vector3, end: Vector3, wallThickness: WallThickness, height: number): WallBuilder {
        const wallPoints = DrawerMath.calculateWallPoints(start, end, wallThickness, height);
        return new WallBuilder(wallPoints);
        // might create 4 sides here
        // IMPORTANT: sides will have their own manipulation logic called from wall when there's collision
        // return created wall with direction and 4 corner points
    }

    public changeProps(props: WallConstruction): WallBuilder {
        this.props = props;
        return this;
    }

    public setCollisionWithWall(collision: Collision<PlacedWall>): WallBuilder {
        this.collision = collision;
        return this;
    }

    public setCollisionWithObject(collision: boolean): WallBuilder {
        this.collision = {
            isCollision: collision,
            adjacentObjects: new Array<AdjacentObject<PlacedWall>>(), // no contact points displayed
        };
        return this;
    }

    public createDrawnWall(): DrawnWall {
        const contactPoints = this.collision.adjacentObjects.flatMap(wall => wall.points);
        return DrawnWall.wallFromPoints(this.props, this.collision.isCollision, contactPoints);
    }

    public createPlacedWall(): PlacedWall {
        return PlacedWall.create(this.props, this.collision.adjacentObjects);
    }

    // getters
    public getProps(): WallConstruction {
        return this.props;
    }
}
