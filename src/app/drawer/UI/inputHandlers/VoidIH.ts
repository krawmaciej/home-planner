import { Vector3 } from "three";
import InputHandler from "./InputHandler";

export default class VoidIH implements InputHandler {
    handleMovement(point: Vector3): void {
        // no op
    }
    handleClick(point: Vector3): void {
        // no op
    }
}