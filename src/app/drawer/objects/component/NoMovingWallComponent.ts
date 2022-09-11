import {ObjectPoints, Vector2D} from "../../constants/Types";
import {IMovingWallComponent} from "./IMovingWallComponent";
import {IPlacedWallComponent} from "./IPlacedWallComponent";
import {Quaternion} from "three";

export class NoMovingWallComponent implements IMovingWallComponent {
    private static readonly instance = new NoMovingWallComponent();

    public static getInstance(): NoMovingWallComponent {
        return this.instance;
    }

    private constructor() {
    }

    createPlacedComponent(): IPlacedWallComponent {
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
    setDistanceFromParentWall(): void {
        throw new Error("Called method on a not initialized component.");
    }
    getHeight(): number {
        throw new Error("Called method on a not initialized component.");
    }
    getElevation(): number {
        throw new Error("Called method on a not initialized component.");
    }
    getWidth(): number {
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
    getOrientation(): Vector2D {
        throw new Error("Called method on a not initialized component.");
    }
    getRotation(): Quaternion {
        throw new Error("Called method on a not initialized component.");
    }
    isDoor(): boolean {
        throw new Error("Called method on a not initialized component.");
    }
    addLabel(): void {
        throw new Error("Called method on a not initialized component.");
    }
    removeLabel(): void {
        throw new Error("Called method on a not initialized component.");
    }
}
