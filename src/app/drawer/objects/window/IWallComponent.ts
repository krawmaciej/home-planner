import { Vector3 } from "three";
import { ISceneObject } from "../ISceneObject";

export interface IWallComponent extends ISceneObject {
    changePosition(point: Vector3): void;
    getPointsOnPlan(position: Vector3): [Vector3, Vector3, Vector3, Vector3],
}
