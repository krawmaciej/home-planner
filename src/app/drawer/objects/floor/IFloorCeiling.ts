import {ISceneObject} from "../ISceneObject";
import {Vector3} from "three";
import {FloorCeiling} from "./FloorCeiling";

export interface IFloorCeiling extends ISceneObject {
    change(start: Vector3, end: Vector3): void;
    collide(): void;
    uncollide(): void;
    place(): FloorCeiling;
}
