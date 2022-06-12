import {MeshStandardMaterial, Vector3} from "three";

export const DEFAULT_WALL_HEIGHT = 25;
export const DEFAULT_WALL_MATERIAL = new MeshStandardMaterial({
    color: 0xbbbbbb,
});

export enum Precision {
    CM_100 = -1,
    CM_10 = 0,
    CM_1 = 1,
    MM_1 = 2,
}

export type Vector2D = {
    x: number,
    z: number
}

export enum ObjectElevation {
    GRID = -1,
    WALL = 0,
    COMPONENT = 0,
    MOVING = 3,
    UI = 4,
}

export type ObjectPoints = [ Vector3, Vector3, Vector3, Vector3 ];

export enum ObjectPoint {
    BOTTOM_LEFT, BOTTOM_RIGHT, TOP_RIGHT, TOP_LEFT
}

export enum ObjectSideOrientation {
    BOTTOM, RIGHT, TOP, LEFT
}
