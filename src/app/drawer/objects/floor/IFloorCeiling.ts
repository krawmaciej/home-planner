import {ISceneObject} from "../ISceneObject";
import {FloorCeiling, FloorCeilingProps} from "./FloorCeiling";
import {IObjectPointsOnScene} from "../IObjectPointsOnScene";

export interface IFloorCeiling extends ISceneObject, IObjectPointsOnScene {
    change({ start, end }: FloorCeilingProps): void;
    collide(): void;
    uncollide(): void;
    place(): FloorCeiling;
}
