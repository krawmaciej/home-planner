import {Vector3} from "three";
import {DrawingState, FloorsPointer} from "./FloorsPointer";
import {IInputHandler} from "../../../../common/canvas/inputHandler/IInputHandler";
import {FloorsDrawer} from "../../../components/floor/FloorsDrawer";
import {ObjectElevation} from "../../../constants/Types";
import {InputPoint} from "../../../../common/canvas/inputHandler/MainInputHandler";

/**
 * Stateful input handler for drawing new floor.
 * Start state is NONE, start point set to 0,0,0.
 */
export class FloorsDrawingIH implements IInputHandler {

    private readonly floorsDrawer: FloorsDrawer;
    private pointer: FloorsPointer;

    public constructor(floorsDrawer: FloorsDrawer) {
        this.floorsDrawer = floorsDrawer;
        this.pointer = new FloorsPointer();
    }

    public handleMovement({ unprojected }: InputPoint): void {
        const position = FloorsDrawingIH.setElevation(unprojected);
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

    public handleClick({ unprojected }: InputPoint): void {
        const position = FloorsDrawingIH.setElevation(unprojected);

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

    public handleCancel(): void {
        switch (this.pointer.state) {
            case DrawingState.NONE:
                // no op
                break;
            case DrawingState.INITIALIZE:
                // no op
                break;
            case DrawingState.DRAWING:
                this.pointer.reset();
                this.floorsDrawer.removeCurrentlyDrawnFloor();
                break;
        }
    }

    private static setElevation(point: Vector3) {
        return point.clone().setY(ObjectElevation.FLOOR);
    }
}
