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
    }

    public beginDrawing(position: Vector3): void {
        this.setState(position, position, DrawingState.INITIALIZE);
    }

    public stopDrawing(position: Vector3): void {
        this.setState(this.startPosition, position, DrawingState.NONE);
    }

    public changePosition(position: Vector3): void {
        if (this.state === DrawingState.INITIALIZE) {
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
