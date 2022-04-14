import { Scene } from "three";

export interface ISceneObject {
    addTo(scene: Scene): void;
    removeFrom(scene: Scene): void;
}
