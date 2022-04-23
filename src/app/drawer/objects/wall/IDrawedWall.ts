import { Scene } from "three";

export interface IDrawedWall {
    removeFrom(scene: Scene): void;
}
