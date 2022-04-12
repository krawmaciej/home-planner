import InputHandler from "./InputHandler";

export default class VoidIH implements InputHandler {
    handleMovement(): void {
        // no op
    }
    handleClick(): void {
        // no op
    }
}