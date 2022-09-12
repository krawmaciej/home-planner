import {Quaternion, Vector3} from "three";
import {PlacedWall} from "../wall/PlacedWall";
import {Vector2D} from "../../constants/Types";
import {IObjectPointsOnScene} from "../IObjectPointsOnScene";
import {ISceneObject} from "../ISceneObject";

export interface IWallComponent extends ISceneObject, IObjectPointsOnScene {
    changePosition(point: Vector3): void;
    setParentWall(wall: PlacedWall): void;
    getParentWall(): PlacedWall | undefined;
    /**
     * Returns distance between bottom left corner of a component
     * and a parent wall if component has a parent wall, undefined otherwise.
     */
    getDistanceFromParentWall(): undefined | number;
    /**
     * Sets distance between bottom left corner of a component and a parent wall.
     * Does nothing if component has no parent wall.
     */
    setDistanceFromParentWall(distance: number): void;
    getHeight(): number;
    getElevation(): number;
    getWidth(): number;
    setNotCollided(): void;
    setCollided(): void;
    collides(): boolean;
    getOrientation(): Vector2D;
    getRotation(): Quaternion;
    isDoor(): boolean;
}
