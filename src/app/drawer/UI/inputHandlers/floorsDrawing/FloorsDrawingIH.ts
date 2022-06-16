import {Vector3} from "three";
import {DrawingState, FloorsPointer} from "./FloorsPointer";
import {IInputHandler} from "../../../../common/canvas/inputHandler/IInputHandler";
import {FloorsDrawer} from "../../../components/FloorsDrawer";
import {ObjectElevation} from "../../../constants/Types";

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
        const position = FloorsDrawingIH.snapToGrid(point);
        switch (this.pointer.state) {
            case DrawingState.NONE:
                // no op
                break;
            case DrawingState.INITIALIZE:
                // start point has been initialized
                this.pointer.changePosition(position);
                this.floorsDrawer.initializeFloor(this.pointer.startPosition, this.pointer.endPosition);
                break;
            case DrawingState.DRAWING:
                this.pointer.changePosition(position);
                this.floorsDrawer.changeDrawnFloor(this.pointer.startPosition, this.pointer.endPosition);
                break;
        }
    }

    public handleClick(point: Vector3): void {
        const position = FloorsDrawingIH.snapToGrid(point);

        switch (this.pointer.state) {
            case DrawingState.NONE:
                this.pointer.beginDrawing(position);
                break;
            case DrawingState.INITIALIZE:
                // no op
                break;
            case DrawingState.DRAWING:
                this.pointer.changePosition(position);
                if (this.floorsDrawer.drawFloor(this.pointer.startPosition, this.pointer.endPosition)) {
                    this.pointer.stopDrawing(position);
                }
                break;
        }
    }

    private static snapToGrid(point: Vector3) {
        return new Vector3(
            Math.round(point.x),
            ObjectElevation.FLOOR,
            Math.round(point.z)
        );
    }
}
