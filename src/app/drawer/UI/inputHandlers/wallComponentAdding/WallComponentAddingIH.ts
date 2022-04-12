import { Vector3 } from "three";
import WallComponentAdder from "../../../components/WallComponentAdder";
import { WindowProps } from "../../../objects/window/WindowComponent";
import InputHandler from "../InputHandler";
import WallComponentPointer, { State } from "./WallComponentPointer";

export default class WallComponentAddingIH implements InputHandler {

    // deps
    private readonly wallComponentAdder: WallComponentAdder;

    // state
    private readonly pointer: WallComponentPointer;

    public constructor(wallComponentAdder: WallComponentAdder) {
        this.wallComponentAdder = wallComponentAdder;
        this.pointer = new WallComponentPointer();
    }

    public handleSelection(windowProps: WindowProps) {
        if (this.pointer.getState() === State.MOVING) {
            this.wallComponentAdder.removeMovingComponent();
        }

        this.pointer.select();
        this.wallComponentAdder.setComponent(windowProps);
    }

    public handleMovement(point: Vector3): void {
        if (this.pointer.getState() === State.SELECTED) {
            this.pointer.move(point); // todo: does it need now to hold position state? also the wallPointer can now keep info only about start point
            this.wallComponentAdder.showMovingComponent(point);
        } else if (this.pointer.getState() === State.MOVING) {
            this.pointer.move(point); // todo: does it need now to hold position state? also the wallPointer can now keep info only about start point
            this.wallComponentAdder.moveComponent(point);
        }
    }

    public handleClick(point: Vector3): void {
        if (this.pointer.getState() === State.MOVING) {
            // todo: if it was possible to place it, otherwise don't place and continue moving
            console.log("placed on: ", point);
            this.pointer.place(point);
            this.wallComponentAdder.addComponentToWall(point);
        }
    }
}
