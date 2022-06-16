import {ISceneObject} from "../ISceneObject";
import {Vector3} from "three";

export interface IFloor extends ISceneObject {
    change(start: Vector3, end: Vector3): void;
}
