import { Vector2, Vector3 } from "three";
import DrawerMath from "../constants/DrawerMath";
import { Vector2D } from "../constants/Types";
import Direction from "./Direction";
import Wall from "./Wall";

export type CornerPoints = {
    topLeft: Vector3,
    bottomRight: Vector3,
    direction: Vector2D
}

export default class WallCreator {

    public static createWall(start: Vector3, end: Vector3) {

        // calculate 4 corner points
        const cornerPoints = DrawerMath.calculateCornerPoints(start, end);


        return this.wallFrom4Sides(cornerPoints);
        // might create 4 sides here
        // IMPORTANT: sides will have their own manipulation logic called from wall when there's collision
        // return created wall with direction and 4 corner points
    }

    private static wallFrom4Sides(cornerPoints: CornerPoints) {
        // console.log(cornerPoints);
        // console.log(direction);
    }

}
