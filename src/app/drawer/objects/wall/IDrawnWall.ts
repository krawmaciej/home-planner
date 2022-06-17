import { Scene } from "three";

export interface IDrawnWall {
    removeFrom(scene: Scene): void;
}
