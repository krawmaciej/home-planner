import { Vector3 } from "three";
import { ObjectElevation } from "../../../constants/Types";
import { ComponentProps } from "../../../objects/window/WallComponent";
import { IInputHandler } from "../../../../common/canvas/inputHandler/IInputHandler";
import { WallComponentPointer, State } from "./WallComponentPointer";
import {Observer} from "../../../controllers/WallComponentController";
import {WallComponentAdder} from "../../../components/WallComponentAdder";

export class WallComponentAddingIH implements IInputHandler {

    // deps
    private readonly wallComponentAdder: WallComponentAdder;

    // observer
    private readonly observer: Observer;

    // state
    private readonly pointer: WallComponentPointer;

    public constructor(wallComponentAdder: WallComponentAdder, observer: Observer) {
        console.log("Reinitialized wall component adding input handler.");
        this.wallComponentAdder = wallComponentAdder;
        this.observer = observer;
        this.pointer = new WallComponentPointer();
    }

    public handleWindowSelection(componentProps: ComponentProps) {
        if (this.pointer.getState() === State.MOVING) {
            this.wallComponentAdder.removeMovingComponent();
        }

        this.pointer.select();
        this.wallComponentAdder.setWindow(componentProps);
    }

    public handleDoorSelection(componentProps: ComponentProps) {
        if (this.pointer.getState() === State.MOVING) {
            this.wallComponentAdder.removeMovingComponent();
        }

        this.pointer.select();
        this.wallComponentAdder.setDoor(componentProps);
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
            this.pointer.place(point);
            this.wallComponentAdder.addComponentToWall(point);
        }
    }

    public handleCancel(): void {
        console.log("Pointer state is " + this.pointer.getState());
        if (this.pointer.getState() === State.MOVING) {
            this.pointer.reset();
            this.wallComponentAdder.removeMovingComponent();
        }
    }
}
