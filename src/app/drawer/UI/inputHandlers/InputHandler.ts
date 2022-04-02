import { Vector3 } from "three";



export default interface InputHandler {
    handleMovement(point: Vector3): void;
    handleClick(point: Vector3): void;
}
