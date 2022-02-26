import { Vector3 } from "three";
import DrawerMath from "../constants/DrawerMath";
import { Vector2D } from "../constants/Types";
import Direction from "./Direction";
import Wall from "./Wall";

export type CornerPoints = {
    topLeft: Vector3,
    bottomRight: Vector3
}

export default class WallCreator {

    public static createWall(start: Vector3, end: Vector3) {
        const direction = DrawerMath.calculateDirection(start, end);

        // calculate 4 corner points
        const cornerPoints = DrawerMath.calculateCornerPoints(start, end, direction);


        return this.wallFrom4Sides(cornerPoints, direction);
        // might create 4 sides here
        // IMPORTANT: sides will have their own manipulation logic called from wall when there's collision
        // return created wall with direction and 4 corner points
    }

    private static wallFrom4Sides(cornerPoints: CornerPoints, direction: Vector2D) {
        // console.log(cornerPoints);
        // console.log(direction);
    }

}
