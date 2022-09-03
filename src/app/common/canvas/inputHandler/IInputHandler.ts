import {InputPoint} from "./MainInputHandler";

export interface IInputHandler {
    handleMovement(point: InputPoint): void;
    handleClick(point: InputPoint): void;
    handleCancel(): void;
}
