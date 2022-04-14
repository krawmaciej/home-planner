import { Vector3 } from "three";
import { AdjecentWall, Collision } from "../../components/CollisionDetector";
import { DrawerMath, WallConstruction } from "../../components/DrawerMath";
import { DrawedWall } from "./DrawedWall";
import { PlacedWall } from "./PlacedWall";
import { WallThickness } from "./WallThickness";

/**
 * Creates a wall properties from which the meshes will be created.
 * Used for collision detection and calculations which do not require meshes.
 */
export class WallBuilder {

    private props: WallConstruction;
    private collision: Collision;

    public constructor(props: WallConstruction) {
        this.props = props;
        this.collision = { isCollision: false, adjecentWalls: new Array<AdjecentWall>() };
    }
    
    public static createWall(start: Vector3, end: Vector3, wallThickness: WallThickness): WallBuilder {
        const wallPoints = DrawerMath.calculateWallPoints(start, end, wallThickness);
        return new WallBuilder(wallPoints);
        // might create 4 sides here
        // IMPORTANT: sides will have their own manipulation logic called from wall when there's collision
        // return created wall with direction and 4 corner points
    }

    public changeProps(props: WallConstruction): WallBuilder {
        this.props = props;
        return this;
    }

    public setCollision(collision: Collision): WallBuilder {
        this.collision = collision;
        return this;
    }

    public createDrawedWall(): DrawedWall {
        const contactPoints = this.collision.adjecentWalls.flatMap(wall => wall.points);
        return DrawedWall.wallFromPoints(this.props, this.collision.isCollision, contactPoints);
    }

    public createPlacedWall(): PlacedWall {
        return PlacedWall.create(this.props, this.collision.adjecentWalls);
    }

    // getters
    public getProps(): WallConstruction {
        return this.props;
    }
}
