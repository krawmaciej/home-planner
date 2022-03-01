import { Dir } from "fs";
import { Vector3 } from "three";
import Direction from "../objects/Direction";
import WallThickness from "../objects/WallThickness";
import { Vector2D } from "./Types";

export type WallPoints = {
    cornerPoints: CornerPoints,
    middlePoints: MiddlePoints
}

export type CornerPoints = {
    topLeft: Vector3,
    bottomRight: Vector3,
    direction: Vector2D
}

export type MiddlePoints = {
    start: Vector3,
    end: Vector3
}

export default class DrawerMath {

    public static calculateDirection(start: Vector3, end: Vector3): Vector2D {
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

    public static calculateWallPoints(start: Vector3, end: Vector3, wallThickness: WallThickness): WallPoints {
        const direction = this.calculateDirection(start, end);
        const cornerPoints = this.calculateCornerPoints(start, end, direction);
        const middlePoints = this.calculateMiddlePoints(cornerPoints, direction, wallThickness);
        return { cornerPoints, middlePoints };
    }

    private static calculateCornerPoints(start: Vector3, end: Vector3, direction: Vector2D): CornerPoints {
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

    private static calculateMiddlePoints(
        {topLeft, bottomRight}: CornerPoints, direction: Direction, wallThickness: WallThickness
    ): MiddlePoints {
        if (direction === Direction.DOWN || direction === Direction.UP) {
            const x = topLeft.x + wallThickness.halfThickness;
            const topZ = topLeft.z - wallThickness.halfThickness;
            const bottomZ = bottomRight.z + wallThickness.halfThickness;
            const middleTop = new Vector3(x, topLeft.y, topZ);
            const middleBottom = new Vector3(x, bottomRight.y, bottomZ);
            return { start: middleTop, end: middleBottom };
        } else { // LEFT or RIGHT
            const z = topLeft.z - wallThickness.halfThickness;
            const leftX = topLeft.x + wallThickness.halfThickness;
            const rightX = bottomRight.x - wallThickness.halfThickness;
            const middleLeft = new Vector3(leftX, topLeft.y, z);
            const middleRight = new Vector3(rightX, bottomRight.y, z);
            return { start: middleLeft, end: middleRight };
        }
    }
}
