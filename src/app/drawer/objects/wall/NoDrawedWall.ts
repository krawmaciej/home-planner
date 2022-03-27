import { Scene } from "three";
import IDrawedWall from "./IDrawedWall";

export default class NoDrawedWall implements IDrawedWall {
    private static readonly instance = new NoDrawedWall();
    public static getInstance(): NoDrawedWall {
        return this.instance;
    };
    private constructor() {}

    public removeFrom(scene: Scene): void {
        // no op
    }
}
