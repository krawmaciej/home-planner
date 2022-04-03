import { Vector3 } from "three";

export enum State {
    NONE, SELECTED, MOVING,
}

export default class WallComponentPointer {

    private static readonly unsetPosition = new Vector3();
    private state: State;
    private position: Vector3;

    public constructor() {
        this.state = State.NONE;
        this.position = WallComponentPointer.unsetPosition;
    }

    public select() {
        this.state = State.SELECTED;
    }

    public move(position: Vector3) {
        this.state = State.MOVING;
        this.position = position;
    }

    public place(position: Vector3) {
        this.state = State.NONE;
        this.position = position;
    }

    public getState(): State {
        return this.state;
    }

    public getPosition(): Vector3 {
        return this.position;
    }
}
