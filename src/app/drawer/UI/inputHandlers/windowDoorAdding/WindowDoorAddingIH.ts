import { posix } from "path";
import { Vector3 } from "three";
import InputHandler from "../InputHandler";
import WindowDoorPointer, { State } from "./WindowDoorPointer";

export default class WindowDoorAddingIH implements InputHandler {

    private readonly pointer: WindowDoorPointer;
    private selection: number;

    public constructor() {
        this.pointer = new WindowDoorPointer();
        this.selection = 0;
    }

    public handleSelection(index: number) {
        if (this.pointer.getState() === State.MOVING) {
            // todo: remove not placed window/door
        }

        this.pointer.select();
        this.selection = index;
        console.log("Selection: ", this.selection);
    }

    public handleMovement(point: Vector3): void {
        if (this.pointer.getState() === State.SELECTED || this.pointer.getState() === State.MOVING) {
            this.pointer.move(point);
            console.log("move: ", point);
        }
    }

    public handleClick(point: Vector3): void {
        if (this.pointer.getState() === State.MOVING) {
            console.log("placed on: ", point);
            // todo: if it was possible to place it, otherwise don't place and continue moving
            this.pointer.place(point);
        }
    }
}
