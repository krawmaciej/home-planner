import { Vector3 } from "three";
import { WallComponentAdder } from "../../../components/WallComponentAdder";
import { ObjectElevation } from "../../../constants/Types";
import { WindowProps } from "../../../objects/window/WindowComponent";
import { IInputHandler } from "../IInputHandler";
import { WallComponentPointer, State } from "./WallComponentPointer";
import {Observer} from "../../../controllers/WallComponentController";

export class WallComponentAddingIH implements IInputHandler {

    // deps
    private readonly wallComponentAdder: WallComponentAdder;

    // observer
    private readonly observer: Observer;

    // state
    private readonly pointer: WallComponentPointer;

    public constructor(wallComponentAdder: WallComponentAdder, observer: Observer) {
        this.wallComponentAdder = wallComponentAdder;
        this.observer = observer;
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
        point.setY(ObjectElevation.MOVING); // y coordinate is elevation
        if (this.pointer.getState() === State.SELECTED) {
            this.pointer.move(point); // todo: does it need now to hold position state? also the wallPointer can now keep info only about start point
            this.wallComponentAdder.showMovingComponent(point);
        } else if (this.pointer.getState() === State.MOVING) {
            this.pointer.move(point); // todo: does it need now to hold position state? also the wallPointer can now keep info only about start point
            const distance = this.wallComponentAdder.moveComponent(point).getDistanceFromParentWall();
            this.observer.setDistance(distance);
        }
    }

    public handleClick(point: Vector3): void {
        point.setY(ObjectElevation.COMPONENT); // y coordinate is elevation
        if (this.pointer.getState() === State.MOVING) {
            // todo: if it was possible to place it, otherwise don't place and continue moving
            console.log("placed on: ", point);
            this.pointer.place(point);
            this.wallComponentAdder.addComponentToWall(point);
        }
    }
}
