import { Vector3 } from "three";
import { Vector2D } from "../constants/Types";
import Direction from "./Direction";
import Wall from "./Wall";

type CornerPoints = {
    topLeft: Vector3,
    bottomRight: Vector3
}

export default class WallCreator {

    public static createWall(start: Vector3, end: Vector3) {
        const direction = this.calculateDirection(start, end);

        // calculate 4 corner points
        const cornerPoints = this.calculateCornerPoints(start, end, direction);


        return this.wallFrom4Sides(cornerPoints, direction);
        // might create 4 sides here
        // IMPORTANT: sides will have their own manipulation logic called from wall when there's collision
        // return created wall with direction and 4 corner points
    }

    private static wallFrom4Sides(cornerPoints: CornerPoints, direction: Vector2D) {
        console.log(cornerPoints);
        console.log(direction);
    }

    private static calculateDirection(start: Vector3, end: Vector3) {
        if (Math.abs(end.x - start.x) > Math.abs(end.z - start.z)) {

            if (start.x > end.x) {
                return Direction.RIGHT;
            } else {
                return Direction.LEFT;
            }

        } else {

            if (start.z > end.z) {
                return Direction.UP;
            } else {
                return Direction.DOWN;
            }

        }
    }

    private static calculateCornerPoints(start: Vector3, end: Vector3, direction: Vector2D) {
        if (direction === Direction.DOWN) {
            return this.handleDownDirection(start, end);
        } else if (direction === Direction.UP) {
            return this.handleUpDirection(start, end);
        } else if (direction === Direction.LEFT) {
            return this.handleLeftDirection(start, end);
        } else if (direction === Direction.RIGHT) {
            return this.handleRightDirection(start, end);
        }
        throw new Error("Drawed wall has no direction");
    }

    private static handleDownDirection(start: Vector3, end: Vector3): CornerPoints {
        const topLeft = start.clone();
        topLeft.x = Math.floor(start.x);
        topLeft.z = Math.ceil(start.z);

        const bottomRight = end.clone();
        bottomRight.x = Math.ceil(start.x);
        bottomRight.z = Math.floor(end.z);
        return { topLeft: topLeft, bottomRight: bottomRight };
    }

    private static handleUpDirection(start: Vector3, end: Vector3): CornerPoints {
        const bottomRight = start.clone();
        bottomRight.x = Math.ceil(start.x);
        bottomRight.z = Math.floor(start.z);

        const topLeft = end.clone();
        topLeft.x = Math.floor(start.x);
        topLeft.z = Math.ceil(end.z);
        return { topLeft: topLeft, bottomRight: bottomRight };
    }

    private static handleLeftDirection(start: Vector3, end: Vector3): CornerPoints {
        const bottomRight = start.clone();
        bottomRight.x = Math.ceil(start.x);
        bottomRight.z = Math.floor(start.z);

        const topLeft = end.clone();
        topLeft.x = Math.floor(end.x);
        topLeft.z = Math.ceil(start.z);
        return { topLeft: topLeft, bottomRight: bottomRight };
    }

    private static handleRightDirection(start: Vector3, end: Vector3): CornerPoints {
        const topLeft = start.clone();
        topLeft.x = Math.floor(start.x);
        topLeft.z = Math.ceil(start.z);

        const bottomRight = end.clone();
        bottomRight.x = Math.ceil(end.x);
        bottomRight.z = Math.floor(start.z);
        return { topLeft: topLeft, bottomRight: bottomRight };
    }
}
