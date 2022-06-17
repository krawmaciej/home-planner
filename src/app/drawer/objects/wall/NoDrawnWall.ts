import { IDrawedWall } from "./IDrawedWall";

export class NoDrawnWall implements IDrawedWall {
    private static readonly instance = new NoDrawnWall();
    public static getInstance(): NoDrawnWall {
        return this.instance;
    }
    private constructor() {}

    public removeFrom(): void {
        // no op
    }
}
