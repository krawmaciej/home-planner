import { Vector3 } from "three";
import Direction from "../objects/Direction";
import { CornerPoints } from "../objects/WallCreator";
import { Vector2D } from "./Types";

export default class DrawerMath {

    public static calculateDirection(start: Vector3, end: Vector3) {
        if (Math.abs(end.x - start.x) > Math.abs(end.z - start.z)) {

            if (start.x < end.x) {
                return Direction.RIGHT;
            } else {
                return Direction.LEFT;
            }

        } else {

            if (start.z < end.z) {
                return Direction.UP;
            } else {
                return Direction.DOWN;
            }

        }
    }

    public static calculateCornerPoints(start: Vector3, end: Vector3, direction: Vector2D) {
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
