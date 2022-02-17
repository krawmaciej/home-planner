import { assert } from "console";

export type Position = {
    x: number,
    y: number,
}

export enum DrawingState {
    NONE, DRAWING, DRAW
}

export class Pointer {

    private static readonly unsetPosition = { x: 0, y: 0 };
    public readonly startPosition: Position;
    public readonly endPosition: Position;
    public readonly state: DrawingState;

    public constructor(start?: Position, end?: Position, state?: DrawingState) {
        this.startPosition = start || Pointer.unsetPosition;
        this.endPosition = end || Pointer.unsetPosition;
        this.state = DrawingState.NONE;
    }

    public startDrawing(position: Position) {
        assert(this.state === DrawingState.NONE, "state none when start drawing");
        return new Pointer(position, Pointer.unsetPosition, DrawingState.DRAWING);
    }

    public stopDrawing(position: Position) {
        assert(this.state === DrawingState.DRAWING, "state drawing when stop drawing");
        return new Pointer(this.startPosition, position, DrawingState.DRAW);
    }

    public draw() {
        assert(this.state === DrawingState.DRAW, "state draw when draw");
        return new Pointer(this.startPosition, this.endPosition, DrawingState.NONE);
    }

    public changePosition(position: Position) {
        if (this.state === DrawingState.DRAWING) {
            assert(this.startPosition !== Pointer.unsetPosition, "drawing start position shouldn't be unset");
            return new Pointer(this.startPosition, position, this.state);
        }
        return this;
    }
}
