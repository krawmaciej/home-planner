import {SceneObjectsState} from "../context/SceneObjectsDefaults";
import {WallComponent} from "../../drawer/objects/component/WallComponent";



export const saveFile = (sceneObjectsState: SceneObjectsState) => {
    for (const placedWall of sceneObjectsState.placedWalls) {
        const wallComponents = [...placedWall.wallComponents];
        for (const wallComponent of wallComponents) {
            (wallComponent as WallComponent).unsetParentWall();
            placedWall.removeComponent(wallComponent);
        }
    }
};
