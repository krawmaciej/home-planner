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