import { IInputHandler } from "./IInputHandler";

export class VoidIH implements IInputHandler {
    handleMovement(): void {
        // no op
    }
    handleClick(): void {
        // no op
    }
}