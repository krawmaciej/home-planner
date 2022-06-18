import {Vector3} from "three";
import {ISceneObject} from "../ISceneObject";
import {PlacedWall} from "../wall/PlacedWall";
import {Vector2D} from "../../constants/Types";

export interface IWallComponent extends ISceneObject {
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
    setNotCollided(): void;
    setCollided(): void;
    collides(): boolean;
    getDirection(): Vector2D;
    isDoor(): boolean;
}
