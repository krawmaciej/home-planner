import { Vector3 } from "three";
import Direction from "../objects/Direction";
import { CornerPoints, MiddlePoints } from "../objects/DrawedWall";
import WallThickness from "../objects/WallThickness";
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

    public static calculateCornerPoints(start: Vector3, end: Vector3) {
        const direction = this.calculateDirection(start, end);

        if (direction === Direction.DOWN) {
            return this.handleDownDirection(start, end, direction);
        } else if (direction === Direction.UP) {
            return this.handleUpDirection(start, end, direction);
        } else if (direction === Direction.LEFT) {
            return this.handleLeftDirection(start, end, direction);
        } else if (direction === Direction.RIGHT) {
            return this.handleRightDirection(start, end, direction);
        }
        throw new Error("Drawed wall has no direction");
    }

    private static handleDownDirection(start: Vector3, end: Vector3, direction: Vector2D): CornerPoints {
        const topLeft = start.clone();
        topLeft.x = Math.floor(start.x);
        topLeft.z = Math.ceil(start.z);

        const bottomRight = end.clone();
        bottomRight.x = Math.ceil(start.x);
        bottomRight.z = Math.floor(end.z);
        return { topLeft: topLeft, bottomRight: bottomRight, direction: direction };
    }

    private static handleUpDirection(start: Vector3, end: Vector3, direction: Vector2D): CornerPoints {
        const bottomRight = start.clone();
        bottomRight.x = Math.ceil(start.x);
        bottomRight.z = Math.floor(start.z);

        const topLeft = end.clone();
        topLeft.x = Math.floor(start.x);
        topLeft.z = Math.ceil(end.z);
        return { topLeft: topLeft, bottomRight: bottomRight, direction: direction };
    }

    private static handleLeftDirection(start: Vector3, end: Vector3, direction: Vector2D): CornerPoints {
        const bottomRight = start.clone();
        bottomRight.x = Math.ceil(start.x);
        bottomRight.z = Math.floor(start.z);

        const topLeft = end.clone();
        topLeft.x = Math.floor(end.x);
        topLeft.z = Math.ceil(start.z);
        return { topLeft: topLeft, bottomRight: bottomRight, direction: direction };
    }

    private static handleRightDirection(start: Vector3, end: Vector3, direction: Vector2D): CornerPoints {
        const topLeft = start.clone();
        topLeft.x = Math.floor(start.x);
        topLeft.z = Math.ceil(start.z);

        const bottomRight = end.clone();
        bottomRight.x = Math.ceil(end.x);
        bottomRight.z = Math.floor(start.z);
        return { topLeft: topLeft, bottomRight: bottomRight, direction: direction };
    }

    // todo: need direction here
    public static calculateMiddlePoints({topLeft, bottomRight}: CornerPoints, wallThickness: WallThickness) {
        const x = topLeft.x + wallThickness.halfThickness;
        const top = topLeft.z 
        const middleTop = new Vector3(middleX)
    }
}
