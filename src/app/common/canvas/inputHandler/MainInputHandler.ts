import { Vector3 } from "three";
import { IInputHandler } from "./IInputHandler";
import {VoidIH} from "./VoidIH";

export type InputPoint = {
    unprojected: Vector3,
    canvasCoords: { x: number, y: number },
}

/**
 * It is stateful because it is shared in canvas.
 * (Does not implement IInputHandler itself to not allow nesting.)
 */
export class MainInputHandler {

    private inputHandler: IInputHandler;

    public constructor() {
        this.inputHandler = new VoidIH();
    }

    public changeHandlingStrategy(inputHandler: IInputHandler) {
        this.inputHandler = inputHandler;
    }

    public handleMovement(point: InputPoint): void {
        this.inputHandler.handleMovement(point);
    }
    
    public handleClick(point: InputPoint): void {
        this.inputHandler.handleClick(point);
    }

    public detachCurrentHandler() {
        this.inputHandler = new VoidIH();
    }
}
