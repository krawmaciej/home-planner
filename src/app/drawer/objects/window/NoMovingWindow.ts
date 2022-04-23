import { ObjectPoints } from "../../constants/Types";
import {IMovingWindowComponent} from "./IMovingWindowComponent";
import {IPlacedWindowComponent} from "./IPlacedWindowComponent";

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
    addTo(): void {
        throw new Error("Method not implemented.");
    }
    removeFrom(): void {
        throw new Error("Method not implemented.");
    }
    objectPointsOnScene(): ObjectPoints {
        throw new Error("Method not implemented.");
    }
    setParentWall(): void {
        throw new Error("Method not implemented.");
    }
    unsetParentWall(): void {
        throw new Error("Method not implemented.");
    }
    getParentWall(): undefined {
        throw new Error("Method not implemented.");
    }
    getDistanceFromParentWall(): number | undefined {
        throw new Error("Method not implemented.");
    }
    setDefaultColour(): void {
        throw new Error("Method not implemented.");
    }
    setCollidedColour(): void {
        throw new Error("Method not implemented.");
    }
}
