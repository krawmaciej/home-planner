import {Scene} from "three";
import {ISceneObject} from "../objects/ISceneObject";

export const addCurrentSceneObjects = (sceneObjects: Array<ISceneObject>, scene: Scene) => {
    sceneObjects.forEach(so => so.addTo(scene));
};
