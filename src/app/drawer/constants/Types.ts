import {DoubleSide, MeshStandardMaterial, Vector3} from "three";

export const DEFAULT_WALL_HEIGHT = 25;
export const DEFAULT_WALL_MATERIAL = new MeshStandardMaterial({
    color: 0xbbbbbb,
    side: DoubleSide,
});

export const DEFAULT_FLOOR_MATERIAL = new MeshStandardMaterial({ color: 0xbbbbbb });

export const DEFAULT_WALL_FRAME_MATERIAL = new MeshStandardMaterial({
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
    GRID = -2,
    FLOOR = -1,
    WALL = 0,
    ARRANGER_OBJECT = 1,
    COMPONENT = 2,
    MOVING = 3,
    UI = 4,
}

export type ObjectPoints = [ Vector3, Vector3, Vector3, Vector3, ];

/**
 * {@link TOP_LEFT} and {@link BOTTOM_RIGHT} are used in bounding a rectangular shape.
 */
export enum ObjectPoint {
    BOTTOM_LEFT, BOTTOM_RIGHT, TOP_RIGHT, TOP_LEFT,
}

export enum ObjectSideOrientation {
    BOTTOM, RIGHT, TOP, LEFT,
}

export type PostProcessedTextureRotation = {
    value: number,
}
