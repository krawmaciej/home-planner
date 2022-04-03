import { posix } from "path";
import { Vector3 } from "three";
import InputHandler from "../InputHandler";
import WallComponentPointer, { State } from "./WallComponentPointer";

export default class WallComponentAddingIH implements InputHandler {

    private readonly pointer: WallComponentPointer;
    private selection: number;

    public constructor() {
        this.pointer = new WallComponentPointer();
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
