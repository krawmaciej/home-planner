import { Vector3 } from "three";

export interface IInputHandler {
    handleMovement(point: Vector3): void;
    handleClick(point: Vector3): void;
}
