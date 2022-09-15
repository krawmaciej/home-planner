import {IFloorCeiling} from "./IFloorCeiling";
import {ObjectPoints} from "../../constants/Types";
import {FloorCeiling} from "./FloorCeiling";

export class NoFloorCeiling implements IFloorCeiling {
    public static readonly INSTANCE = new NoFloorCeiling();
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
    place(): FloorCeiling {
        throw new Error("Called method on a not initialized floor.");
    }
    collide(): void {
        throw new Error("Called method on a not initialized floor.");
    }
    uncollide(): void {
        throw new Error("Called method on a not initialized floor.");
    }
    addLabel(): void {
        throw new Error("Called method on a not initialized floor.");
    }
    removeLabel(): void {
        throw new Error("Called method on a not initialized floor.");
    }
    highlight(): void {
        throw new Error("Called method on a not initialized floor.");
    }
    unHighlight(): void {
        throw new Error("Called method on a not initialized floor.");
    }
}
