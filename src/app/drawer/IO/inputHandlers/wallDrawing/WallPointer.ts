import { Vector3 } from "three";

export enum DrawingState {
    NONE, DRAWING, DRAW
}

// todo: refactor to be statefull instead of immutable, this is kinda state pattern
export class WallPointer {

    private static readonly unsetPosition = new Vector3();
    public readonly startPosition: Vector3;
    public readonly endPosition: Vector3;
    public readonly state: DrawingState;

    public constructor(start?: Vector3, end?: Vector3, state?: DrawingState) {
        this.startPosition = start || WallPointer.unsetPosition;
        this.endPosition = end || WallPointer.unsetPosition;
        this.state = state || DrawingState.NONE;
    }

    public startDrawing(position: Vector3) {
        console.log("drawing");
        // assert(this.state === DrawingState.NONE, "state none when start drawing");
        return new WallPointer(position, WallPointer.unsetPosition, DrawingState.DRAWING);
    }

    public stopDrawing(position: Vector3) {
        console.log("stop drawing");
        // assert(this.state === DrawingState.DRAWING, "state drawing when stop drawing");
        return new WallPointer(this.startPosition, position, DrawingState.DRAW);
    }

    public draw() {
        console.log("draw");
        // assert(this.state === DrawingState.DRAW, "state draw when draw");
        return new WallPointer(this.startPosition, this.endPosition, DrawingState.NONE);
    }

    public changePosition(position: Vector3) {
        if (this.state === DrawingState.DRAWING) {
            // assert(this.startPosition !== Pointer.unsetPosition, "drawing start position shouldn't be unset");
            return new WallPointer(this.startPosition, position, this.state);
        }
        return this;
    }

    public reset() {
        return new WallPointer();
    }
}
