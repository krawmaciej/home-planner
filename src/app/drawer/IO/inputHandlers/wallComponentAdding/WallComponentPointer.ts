import { Vector3 } from "three";

export enum State {
    NONE, SELECTED, MOVING, ORIENTING,
}

export class WallComponentPointer {

    private static readonly unsetPosition = new Vector3();
    private state: State;

    public constructor() {
        this.state = State.NONE;
        console.log("Pointer state set to none");
    }

    public select() {
        this.state = State.SELECTED;
    }

    public move() {
        this.state = State.MOVING;
    }

    public place() {
        this.state = State.ORIENTING;
    }

    public orient() {
        this.state = State.SELECTED;
    }

    public reset() {
        this.state = State.NONE;
    }

    public getState(): State {
        return this.state;
    }
}
