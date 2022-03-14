import { Vector3 } from "three";
import DrawerMath, { WallConstruction } from "../components/DrawerMath";
import Drawed from "./Drawed";
import WallThickness from "./WallThickness";

export default class DrawedWallBuilder {

    public props: WallConstruction;
    public isCollided: boolean = false;

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

    public setCollided(collided: boolean): DrawedWallBuilder {
        this.isCollided = collided;
        return this;
    }

    public build(): Drawed {
        return Drawed.wallFromPoints(this.props, this.isCollided);
    }
}
