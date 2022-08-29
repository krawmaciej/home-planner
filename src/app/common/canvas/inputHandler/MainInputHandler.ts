import { Vector3 } from "three";
import { IInputHandler } from "./IInputHandler";
import {VoidIH} from "./VoidIH";

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

    public handleMovement(point: Vector3): void {
        this.delegate.handleMovement(point);
    }
    
    public handleClick(point: Vector3): void {
        this.delegate.handleClick(point);
    }

    public detachCurrentHandler() {
        this.delegate = new VoidIH();
    }
}
