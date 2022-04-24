import { Vector3 } from "three";
import { IInputHandler } from "./IInputHandler";

/**
 * It is stateful because it is used by the canvas.
 * (Is not a delegate itself to not allow nesting.)
 */
export class MainInputHandler {

    private delegate: IInputHandler;

    public constructor(inputHandler: IInputHandler) {
        this.delegate = inputHandler;
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
}
