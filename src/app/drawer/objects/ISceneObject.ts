import {Scene} from "three";

export interface ISceneObject {
    addTo(scene: Scene): void;
    removeFrom(scene: Scene): void;
    highlight(): void;
    unHighlight(): void;
    addLabel(): void;
    removeLabel(): void;
}
