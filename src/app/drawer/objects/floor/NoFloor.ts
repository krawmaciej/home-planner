import {IFloor} from "./IFloor";
import {ObjectPoints} from "../../constants/Types";
import {Floor} from "./Floor";

export class NoFloor implements IFloor {
    public static readonly INSTANCE = new NoFloor();
    change(): void {
        throw new Error("Called method on a not initialized floor.");
    }
    addTo(): void {
        throw new Error("Called method on a not initialized floor.");
    }
    getObjectPointsOnScene(): ObjectPoints {
        throw new Error("Called method on a not initialized floor.");
    }
    removeFrom(): void {
        throw new Error("Called method on a not initialized floor.");
    }
    place(): Floor {
        throw new Error("Called method on a not initialized floor.");
    }
    collide(): void {
        throw new Error("Called method on a not initialized floor.");
    }
    uncollide(): void {
        throw new Error("Called method on a not initialized floor.");
    }
}
