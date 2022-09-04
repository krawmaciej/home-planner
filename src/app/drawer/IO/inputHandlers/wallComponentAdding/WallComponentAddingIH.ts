import {ObjectElevation} from "../../../constants/Types";
import {ComponentProps} from "../../../objects/window/WallComponent";
import {IInputHandler} from "../../../../common/canvas/inputHandler/IInputHandler";
import {State, WallComponentPointer} from "./WallComponentPointer";
import {Observer} from "../../../controllers/WallComponentController";
import {WallComponentAdder} from "../../../components/WallComponentAdder";
import {InputPoint} from "../../../../common/canvas/inputHandler/MainInputHandler";

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

    public handleMovement({ unprojected} : InputPoint): void {
        unprojected.setY(ObjectElevation.MOVING); // y coordinate is elevation
        if (this.pointer.getState() === State.SELECTED) {
            this.pointer.move(); // todo: does it need now to hold position state? also the wallPointer can now keep info only about start point
            this.wallComponentAdder.showMovingComponent(unprojected);
        } else if (this.pointer.getState() === State.MOVING) {
            this.pointer.move(); // todo: does it need now to hold position state? also the wallPointer can now keep info only about start point
            const distance = this.wallComponentAdder.moveComponent(unprojected).getDistanceFromParentWall();
            this.observer.setDistance(distance);
        } else if (this.pointer.getState() === State.ORIENTING) {
            this.wallComponentAdder.orientComponent(unprojected);
        }
    }

    public handleClick({ unprojected} : InputPoint): void {
        unprojected.setY(ObjectElevation.COMPONENT); // y coordinate is elevation
        if (this.pointer.getState() === State.MOVING) {
            if (this.wallComponentAdder.addComponentToWall(unprojected)) {
                this.pointer.place();
            }
        } else if (this.pointer.getState() === State.ORIENTING) {
            this.pointer.orient();
            this.wallComponentAdder.orientComponent(unprojected);
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
