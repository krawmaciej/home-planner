import { Vector3 } from "three";

export enum DrawingState {
    NONE, DRAWING, DRAW
}

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
        return new WallPointer(position, position, DrawingState.DRAWING);
    }

    public stopDrawing(position: Vector3) {
        return new WallPointer(this.startPosition, position, DrawingState.DRAW);
    }

    public draw() {
        return new WallPointer(this.startPosition, this.endPosition, DrawingState.NONE);
    }

    public changePosition(position: Vector3) {
        if (this.state === DrawingState.DRAWING) {
            return new WallPointer(this.startPosition, position, this.state);
        }
        return this;
    }

    public reset() {
        return new WallPointer();
    }
}
