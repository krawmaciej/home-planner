import { Vector3 } from "three";

export enum DrawingState {
    NONE, INITIALIZE, DRAWING,
}

export class FloorsPointer {

    private static readonly unsetPosition = new Vector3();

    public startPosition: Vector3;
    public endPosition: Vector3;
    public state: DrawingState;

    public constructor(start?: Vector3, end?: Vector3, state?: DrawingState) {
        this.startPosition = start || FloorsPointer.unsetPosition;
        this.endPosition = end || FloorsPointer.unsetPosition;
        this.state = state || DrawingState.NONE;
    }

    public beginDrawing(position: Vector3): void {
        // assert(this.state === DrawingState.NONE, "state none when start drawing");
        this.setState(position, FloorsPointer.unsetPosition, DrawingState.INITIALIZE);
    }

    public stopDrawing(position: Vector3): void {
        // assert(this.state === DrawingState.DRAW, "state draw when draw");
        this.setState(this.startPosition, position, DrawingState.NONE);
    }

    public changePosition(position: Vector3): void {
        if (this.state === DrawingState.INITIALIZE) {
            // assert(this.startPosition !== Pointer.unsetPosition, "drawing start position shouldn't be unset");
            this.setState(this.startPosition, position, DrawingState.DRAWING);
        }
        this.setState(this.startPosition, position, this.state);
    }

    private setState(start: Vector3, end: Vector3, state: DrawingState) {
        this.startPosition = start;
        this.endPosition = end;
        this.state = state;
    }

}
