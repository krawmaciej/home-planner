import {Vector3} from "three";
import {ISceneObject} from "../ISceneObject";
import {PlacedWall} from "../wall/PlacedWall";
import {Vector2D} from "../../constants/Types";

export interface IWallComponent extends ISceneObject {
    changePosition(point: Vector3): void;
    setParentWall(wall: PlacedWall): void;
    getParentWall(): PlacedWall | undefined;
    getDistanceFromParentWall(): undefined | number;
    getHeight(): number;
    getElevation(): number;
    setNotCollided(): void;
    setCollided(): void;
    collides(): boolean;

    getDirection(): Vector2D;
}
