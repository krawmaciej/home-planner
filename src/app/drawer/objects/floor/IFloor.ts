import {ISceneObject} from "../ISceneObject";
import {Vector3} from "three";
import {Floor} from "./Floor";

export interface IFloor extends ISceneObject {
    change(start: Vector3, end: Vector3): void;
    collide(): void;
    uncollide(): void;
    place(): Floor;
}
