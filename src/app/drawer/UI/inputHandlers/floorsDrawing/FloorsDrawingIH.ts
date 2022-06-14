import {Vector3} from "three";
import {DrawingState, FloorsPointer} from "./FloorsPointer";
import {IInputHandler} from "../../../../common/canvas/inputHandler/IInputHandler";
import {FloorsDrawer} from "../../../components/FloorsDrawer";

/**
 * Stateful input handler for drawing new floors.
 * Start state is NONE, start point set to 0,0,0.
 */
export class FloorsDrawingIH implements IInputHandler {

    private readonly floorsDrawer: FloorsDrawer;
    private pointer: FloorsPointer;

    public constructor(floorsDrawer: FloorsDrawer) {
        this.floorsDrawer = floorsDrawer;
        this.pointer = new FloorsPointer();
    }

    public handleMovement(point: Vector3): void {
        switch (this.pointer.state) {
            case DrawingState.NONE:
                // no op
                break;
            case DrawingState.INITIALIZE:
                // start point has been initialized
                this.pointer.changePosition(point);
                this.floorsDrawer.initializeFloor(this.pointer.startPosition, this.pointer.endPosition);
                break;
            case DrawingState.DRAWING:
                this.pointer.changePosition(point);
                this.floorsDrawer.changeDrawnFloor(this.pointer.startPosition, this.pointer.endPosition);
                break;
        }
    }

    public handleClick(point: Vector3): void {
        switch (this.pointer.state) {
            case DrawingState.NONE:
                this.pointer.beginDrawing(point);
                break;
            case DrawingState.INITIALIZE:
                // no op
                break;
            case DrawingState.DRAWING:
                this.pointer.stopDrawing(point);
                this.floorsDrawer.drawFloor(this.pointer.startPosition, this.pointer.endPosition);
                break;
        }
    }
}
