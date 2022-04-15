import { Vector3 } from "three";
import { Direction } from "../objects/wall/Direction";
import { WallThickness } from "../objects/wall/WallThickness";
import {ObjectElevation, ObjectPoints, Vector2D} from "../constants/Types";

export type WallConstruction = {
    points: ObjectPoints,
    middlePoints: MiddlePoints,
    direction: Vector2D
}

export type MiddlePoints = {
    first: Vector3,
    last: Vector3
}

export enum WallPoint {
    TOP_LEFT, TOP_RIGHT, BOTTOM_RIGHT, BOTTOM_LEFT
}

export class DrawerMath {

    public static readonly COMPARISON_ACCURACY = 0.01; // one millimeter, 1 is 10 cm

    public static isPointBetweenMinMaxPoints(point: Vector3, min: Vector3, max: Vector3): boolean {
        if (point.x > min.x && point.z > min.z) {
            if (point.x < max.x && point.z < max.z) {
                return true;
            }
        }
        // needs checking equality because of the floating point representation
        return DrawerMath.areVectorsEqual(point, min) || DrawerMath.areVectorsEqual(point, max);
    }

    public static areVectorsEqual(v1: Vector3, v2: Vector3): boolean {
        return (
            (Math.abs( v1.x - v2.x) < DrawerMath.COMPARISON_ACCURACY) &&
            (Math.abs( v1.z - v2.z ) < DrawerMath.COMPARISON_ACCURACY)
        );
    }

    public static distanceBetweenVectors(v1: Vector3, v2: Vector3): number {
        return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) +
                            (v1.z - v2.z) * (v1.z - v2.z)
        );
    }

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

    private static calculateCornerPoints(start: Vector3, end: Vector3, direction: Vector2D): ObjectPoints {
        if (direction === Direction.DOWN) {
            return DrawerMath.handleDownDirection(start, end);
        } else if (direction === Direction.UP) {
            return DrawerMath.handleUpDirection(start, end);
        } else if (direction === Direction.LEFT) {
            return DrawerMath.handleLeftDirection(start, end);
        } else if (direction === Direction.RIGHT) {
            return DrawerMath.handleRightDirection(start, end);
        }
        throw new Error("Drawed wall has no direction");
    }

    private static handleDownDirection(start: Vector3, end: Vector3): ObjectPoints {
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

    private static handleUpDirection(start: Vector3, end: Vector3): ObjectPoints {
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

    private static handleLeftDirection(start: Vector3, end: Vector3): ObjectPoints {
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

    private static handleRightDirection(start: Vector3, end: Vector3): ObjectPoints {
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
        points: ObjectPoints, direction: Direction, wallThickness: WallThickness
    ): MiddlePoints {
        const topLeft = points[WallPoint.TOP_LEFT];
        const bottomRight = points[WallPoint.BOTTOM_RIGHT];

        if (direction === Direction.DOWN || direction === Direction.UP) {
            const x = topLeft.x + wallThickness.halfThickness;
            const topZ = topLeft.z - wallThickness.halfThickness;
            const bottomZ = bottomRight.z + wallThickness.halfThickness;
            const middleTop = new Vector3(x, ObjectElevation.UI, topZ);
            const middleBottom = new Vector3(x, ObjectElevation.UI, bottomZ);
            return { first: middleTop, last: middleBottom };
        } else { // LEFT or RIGHT
            const z = topLeft.z - wallThickness.halfThickness;
            const leftX = topLeft.x + wallThickness.halfThickness;
            const rightX = bottomRight.x - wallThickness.halfThickness;
            const middleLeft = new Vector3(leftX, ObjectElevation.UI, z);
            const middleRight = new Vector3(rightX, ObjectElevation.UI, z);
            return { first: middleLeft, last: middleRight };
        }
    }
}
