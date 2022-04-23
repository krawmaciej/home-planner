import {Vector3} from "three";

export type PointerPosition = {
    x: number,
    y: number,
    isDown: boolean
}

export enum PointerDrawingState {
    NONE, DRAWING, DRAW
}

export type Vector2D = {
    x: number,
    y: number
}

export enum RenderOrder {
    GRID = 0,
    WALL = 0,
    COMPONENT = 0,
    UI = 0,
}

export enum ObjectElevation {
    WALL = 1,
    COMPONENT = 2,
    MOVING = 3,
    UI = 4,
}

export enum WallSide {
}

export type ObjectPoints = [ Vector3, Vector3, Vector3, Vector3 ];

export enum ObjectPoint {
    TOP_LEFT, TOP_RIGHT, BOTTOM_RIGHT, BOTTOM_LEFT
}
