import {SceneObjectsState} from "../../common/context/SceneObjectsDefaults";
import {Scene} from "three";

export const addCurrentSceneObjects = (currentSceneObjects: SceneObjectsState, scene: Scene) => {
    currentSceneObjects.floors.forEach(f => f.addTo(scene));
    currentSceneObjects.placedWalls.forEach(f => f.addTo(scene));
    currentSceneObjects.wallComponents.forEach(f => f.addTo(scene));
};
