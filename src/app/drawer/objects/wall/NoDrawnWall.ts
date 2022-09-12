import { IDrawnWall } from "./IDrawnWall";
import {ObjectPoints} from "../../constants/Types";
import {Vector3} from "three";

export class NoDrawnWall implements IDrawnWall {
    private static readonly ZERO_VECTOR = new Vector3(0, 0, 0);
    private static readonly instance = new NoDrawnWall();
    public static getInstance(): NoDrawnWall {
        return this.instance;
    }
    private constructor() {
    }

    public removeFrom(): void {
        // no op
    }
    addLabel(): void {
        // no op
    }
    addTo(): void {
        // no op
    }
    getObjectPointsOnScene(): ObjectPoints {
        return [NoDrawnWall.ZERO_VECTOR, NoDrawnWall.ZERO_VECTOR, NoDrawnWall.ZERO_VECTOR, NoDrawnWall.ZERO_VECTOR];
    }
    removeLabel(): void {
        // no op
    }
}
