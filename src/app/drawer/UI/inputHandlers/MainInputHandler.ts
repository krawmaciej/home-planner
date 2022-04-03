import { Vector3 } from "three";
import InputHandler from "./InputHandler";

/**
 * It is stateful because it is used by the canvas.
 * (Is not a delegate itself to not allow nesting.)
 */
export default class MainInputHandler {

    private delegate: InputHandler;

    public constructor(inputHandler: InputHandler) {
        this.delegate = inputHandler;
    }

    public changeHandlingStrategy(inputHandler: InputHandler) {
        this.delegate = inputHandler;
    }

    public handleMovement(point: Vector3): void {
        this.delegate.handleMovement(point);
    }
    
    public handleClick(point: Vector3): void {
        this.delegate.handleClick(point);
    }
}
