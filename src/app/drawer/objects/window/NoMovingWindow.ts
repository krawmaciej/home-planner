import { Vector3 } from "three";
import { IMovingWindowComponent } from "./IMovingWindowComponent";
import { IPlacedWindowComponent } from "./IPlacedWindowComponent";

export class NoMovingWindow implements IMovingWindowComponent {
    private static readonly instance = new NoMovingWindow();
    public static getInstance(): NoMovingWindow {
        return this.instance;
    }
    private constructor() {}

    createPlacedComponent(): IPlacedWindowComponent {
        throw new Error("Method not implemented.");
    }
    changePosition(): void {
        throw new Error("Method not implemented.");
    }
    getPointsOnPlan(): [Vector3, Vector3, Vector3, Vector3] {
        throw new Error("Method not implemented.");
    }
    addTo(): void {
        throw new Error("Method not implemented.");
    }
    removeFrom(): void {
        throw new Error("Method not implemented.");
    }
}
