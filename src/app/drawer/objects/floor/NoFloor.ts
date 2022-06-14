import {IFloor} from "./IFloor";
import {ObjectPoints} from "../../constants/Types";

export class NoFloor implements IFloor {
    public static readonly INSTANCE = new NoFloor();
    addTo(): void {
        throw new Error("Called method on a not initialized floor.");
    }
    getObjectPointsOnScene(): ObjectPoints {
        throw new Error("Called method on a not initialized floor.");
    }
    removeFrom(): void {
        throw new Error("Called method on a not initialized floor.");
    }
}
