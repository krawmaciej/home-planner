import { Scene } from "three";

export default interface ISceneObject {
    addTo(scene: Scene): void;
    removeFrom(scene: Scene): void;
}
