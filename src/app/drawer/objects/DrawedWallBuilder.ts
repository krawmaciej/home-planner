import { BufferGeometry, CircleGeometry, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, Vector3 } from "three";
import DrawerMath, { CornerPoints, MiddlePoints, WallConstruction } from "../constants/DrawerMath";
import { Vector2D } from "../constants/Types";
import Drawed from "./Drawed";
import WallThickness from "./WallThickness";

export default class DrawedWallBuilder {

    private props: WallConstruction;

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

    public changeProps(props: WallConstruction) {
        this.props = props;
    }

    public build(): Drawed {
        return Drawed.wallFromPoints(this.props);
    }
}
