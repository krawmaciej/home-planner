import { IDrawnWall } from "./IDrawnWall";

export class NoDrawnWall implements IDrawnWall {
    private static readonly instance = new NoDrawnWall();
    public static getInstance(): NoDrawnWall {
        return this.instance;
    }
    private constructor() {}

    public removeFrom(): void {
        // no op
    }
}
