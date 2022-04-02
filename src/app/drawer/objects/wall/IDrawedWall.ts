import { Scene } from "three";

export default interface IDrawedWall {
    removeFrom(scene: Scene): void;
}
