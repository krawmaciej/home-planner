import { Vector3 } from "three";

export enum DrawingState {
    NONE, INITIALIZE, DRAWING,
}

export class FloorsPointer {

    private static readonly UNSET_POSITION = new Vector3();

    public startPosition: Vector3;
    public endPosition: Vector3;
    public state: DrawingState;

    public constructor() {
        this.startPosition = FloorsPointer.UNSET_POSITION;
        this.endPosition = FloorsPointer.UNSET_POSITION;
        this.state = DrawingState.NONE;
        console.log("Created new floors pointer");
    }

    public beginDrawing(position: Vector3): void {
        // assert(this.state === DrawingState.NONE, "state none when start drawing");
        this.setState(position, FloorsPointer.UNSET_POSITION, DrawingState.INITIALIZE);
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

    public reset(): void {
        this.setState(FloorsPointer.UNSET_POSITION, FloorsPointer.UNSET_POSITION, DrawingState.NONE);
    }

    private setState(start: Vector3, end: Vector3, state: DrawingState) {
        this.startPosition = start;
        this.endPosition = end;
        this.state = state;
    }

}
