import { Vector3 } from "three";
import Direction from "../objects/Direction";
import WallThickness from "../objects/wall/WallThickness";
import { Vector2D } from "../constants/Types";

export type WallConstruction = {
    points: [Vector3, Vector3, Vector3, Vector3],
    middlePoints: MiddlePoints,
    direction: Vector2D
}

export type MiddlePoints = {
    top: Vector3,
    bottom: Vector3
}

export enum WallPoint {
    TOP_LEFT, TOP_RIGHT, BOTTOM_RIGHT, BOTTOM_LEFT
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

    public static calculateWallPoints(start: Vector3, end: Vector3, wallThickness: WallThickness): WallConstruction {
        const direction = DrawerMath.calculateDirection(start, end);
        const points = DrawerMath.calculateCornerPoints(start, end, direction);
        const middlePoints = DrawerMath.calculateMiddlePoints(points, direction, wallThickness);
        return { points: points, direction, middlePoints };
    }

    private static calculateCornerPoints(start: Vector3, end: Vector3, direction: Vector2D): [Vector3, Vector3, Vector3, Vector3] {
        if (direction === Direction.DOWN) {
            return DrawerMath.handleDownDirection(start, end, direction);
        } else if (direction === Direction.UP) {
            return DrawerMath.handleUpDirection(start, end, direction);
        } else if (direction === Direction.LEFT) {
            return DrawerMath.handleLeftDirection(start, end, direction);
        } else if (direction === Direction.RIGHT) {
            return DrawerMath.handleRightDirection(start, end, direction);
        }
        throw new Error("Drawed wall has no direction");
    }

    private static handleDownDirection(start: Vector3, end: Vector3, direction: Vector2D): [Vector3, Vector3, Vector3, Vector3] {
        const topLeft = start.clone();
        topLeft.x = Math.floor(start.x);
        topLeft.z = Math.ceil(start.z);

        const bottomRight = end.clone();
        bottomRight.x = Math.ceil(start.x);
        bottomRight.z = Math.floor(end.z);

        const topRight = topLeft.clone();
        topRight.x = bottomRight.x;

        const bottomLeft = bottomRight.clone();
        bottomLeft.x = topLeft.x;

        return [topLeft, topRight, bottomRight, bottomLeft];
    }

    private static handleUpDirection(start: Vector3, end: Vector3, direction: Vector2D): [Vector3, Vector3, Vector3, Vector3] {
        const bottomRight = start.clone();
        bottomRight.x = Math.ceil(start.x);
        bottomRight.z = Math.floor(start.z);

        const topLeft = end.clone();
        topLeft.x = Math.floor(start.x);
        topLeft.z = Math.ceil(end.z);

        const topRight = topLeft.clone();
        topRight.x = bottomRight.x;

        const bottomLeft = bottomRight.clone();
        bottomLeft.x = topLeft.x;

        return [topLeft, topRight, bottomRight, bottomLeft];
    }

    private static handleLeftDirection(start: Vector3, end: Vector3, direction: Vector2D): [Vector3, Vector3, Vector3, Vector3] {
        const bottomRight = start.clone();
        bottomRight.x = Math.ceil(start.x);
        bottomRight.z = Math.floor(start.z);

        const topLeft = end.clone();
        topLeft.x = Math.floor(end.x);
        topLeft.z = Math.ceil(start.z);

        const topRight = topLeft.clone();
        topRight.x = bottomRight.x;

        const bottomLeft = bottomRight.clone();
        bottomLeft.x = topLeft.x;

        return [topLeft, topRight, bottomRight, bottomLeft];
    }

    private static handleRightDirection(start: Vector3, end: Vector3, direction: Vector2D): [Vector3, Vector3, Vector3, Vector3] {
        const topLeft = start.clone();
        topLeft.x = Math.floor(start.x);
        topLeft.z = Math.ceil(start.z);

        const bottomRight = end.clone();
        bottomRight.x = Math.ceil(end.x);
        bottomRight.z = Math.floor(start.z);

        const topRight = topLeft.clone();
        topRight.x = bottomRight.x;

        const bottomLeft = bottomRight.clone();
        bottomLeft.x = topLeft.x;

        return [topLeft, topRight, bottomRight, bottomLeft];
    }

    private static calculateMiddlePoints(
        points: [Vector3, Vector3, Vector3, Vector3], direction: Direction, wallThickness: WallThickness
    ): MiddlePoints {
        const topLeft = points[WallPoint.TOP_LEFT];
        const bottomRight = points[WallPoint.BOTTOM_RIGHT];

        if (direction === Direction.DOWN || direction === Direction.UP) {
            const x = topLeft.x + wallThickness.halfThickness;
            const topZ = topLeft.z - wallThickness.halfThickness;
            const bottomZ = bottomRight.z + wallThickness.halfThickness;
            const middleTop = new Vector3(x, topLeft.y, topZ);
            const middleBottom = new Vector3(x, bottomRight.y, bottomZ);
            return { top: middleTop, bottom: middleBottom };
        } else { // LEFT or RIGHT
            const z = topLeft.z - wallThickness.halfThickness;
            const leftX = topLeft.x + wallThickness.halfThickness;
            const rightX = bottomRight.x - wallThickness.halfThickness;
            const middleLeft = new Vector3(leftX, topLeft.y, z);
            const middleRight = new Vector3(rightX, bottomRight.y, z);
            return { top: middleLeft, bottom: middleRight };
        }
    }
}
