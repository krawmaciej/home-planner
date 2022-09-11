export enum State {
    NONE, SELECTED, MOVING, ORIENTING,
}

export class WallComponentPointer {

    private state: State;

    public constructor() {
        this.state = State.NONE;
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
