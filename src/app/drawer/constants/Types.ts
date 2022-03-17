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
    GRID = -1,
    WALL = 1,
    COMPONENT = 2,
    UI = 3
}

export enum ComponentElevation {
    WALL = 1,
    COMPONENT = 2,
    UI = 3
}