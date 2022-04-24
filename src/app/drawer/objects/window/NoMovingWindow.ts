import {ObjectPoints, Vector2D} from "../../constants/Types";
import {IMovingWindowComponent} from "./IMovingWindowComponent";
import {IPlacedWindowComponent} from "./IPlacedWindowComponent";

export class NoMovingWindow implements IMovingWindowComponent {
    private static readonly instance = new NoMovingWindow();
    public static getInstance(): NoMovingWindow {
        return this.instance;
    }
    private constructor() {}

    createPlacedComponent(): IPlacedWindowComponent {
        throw new Error("Called method on a not initialized component.");
    }
    changePosition(): void {
        throw new Error("Called method on a not initialized component.");
    }
    addTo(): void {
        throw new Error("Called method on a not initialized component.");
    }
    removeFrom(): void {
        throw new Error("Called method on a not initialized component.");
    }
    getObjectPointsOnScene(): ObjectPoints {
        throw new Error("Called method on a not initialized component.");
    }
    setParentWall(): void {
        throw new Error("Called method on a not initialized component.");
    }
    unsetParentWall(): void {
        throw new Error("Called method on a not initialized component.");
    }
    getParentWall(): undefined {
        throw new Error("Called method on a not initialized component.");
    }
    getDistanceFromParentWall(): number | undefined {
        throw new Error("Called method on a not initialized component.");
    }
    setNotCollided(): void {
        throw new Error("Called method on a not initialized component.");
    }
    setCollided(): void {
        throw new Error("Called method on a not initialized component.");
    }
    collides(): boolean {
        throw new Error("Called method on a not initialized component.");
    }
    getDirection(): Vector2D {
        throw new Error("Called method on a not initialized component.");
    }
}
