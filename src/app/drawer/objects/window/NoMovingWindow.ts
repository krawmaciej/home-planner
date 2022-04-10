import { Vector3, Scene } from "three";
import ISceneObject from "../ISceneObject";
import IMovingWindowComponent from "./IMovingWindowComponent";
import IPlacedWindowComponent from "./IPlacedWindowComponent";

export default class NoMovingWindow implements IMovingWindowComponent {
    private static readonly instance = new NoMovingWindow();
    public static getInstance(): NoMovingWindow {
        return this.instance;
    };
    private constructor() {}

    createPlacedComponent(position: Vector3): IPlacedWindowComponent {
        throw new Error("Method not implemented.");
    }
    changePosition(point: Vector3): void {
        throw new Error("Method not implemented.");
    }
    getPointsOnPlan(position: Vector3): void {
        throw new Error("Method not implemented.");
    }
    addTo(scene: Scene): NoMovingWindow {
        throw new Error("Method not implemented.");
    }
    removeFrom(scene: Scene): NoMovingWindow {
        throw new Error("Method not implemented.");
    }
}
