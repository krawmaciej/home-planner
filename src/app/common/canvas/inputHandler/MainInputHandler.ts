import { Vector3 } from "three";
import { IInputHandler } from "./IInputHandler";
import {VoidIH} from "./VoidIH";

export type InputPoint = {
    unprojected: Vector3,
    canvasCoords: { x: number, y: number },
}

/**
 * It is stateful because it is shared in canvas.
 * (Is not a delegate itself to not allow nesting.)
 */
export class MainInputHandler {

    private delegate: IInputHandler;

    public constructor() {
        this.delegate = new VoidIH();
    }

    public changeHandlingStrategy(inputHandler: IInputHandler) {
        this.delegate = inputHandler;
    }

    public handleMovement(point: InputPoint): void {
        this.delegate.handleMovement(point);
    }
    
    public handleClick(point: InputPoint): void {
        this.delegate.handleClick(point);
    }

    public detachCurrentHandler() {
        this.delegate = new VoidIH();
    }

    public handleCancel() {
        this.delegate.handleCancel();
    }
}
