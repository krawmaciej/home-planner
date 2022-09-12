import {ISceneObject} from "../ISceneObject";
import {Vector3} from "three";
import {FloorCeiling} from "./FloorCeiling";
import {IObjectPointsOnScene} from "../IObjectPointsOnScene";

export interface IFloorCeiling extends ISceneObject, IObjectPointsOnScene {
    change(start: Vector3, end: Vector3): void;
    collide(): void;
    uncollide(): void;
    place(): FloorCeiling;
}
