import { Scene } from "three";

export default interface ISceneObject {
    addTo(scene: Scene): ISceneObject;
    removeFrom(scene: Scene): ISceneObject;
}
