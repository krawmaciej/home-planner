import {SceneObjectsState} from "../../../common/context/SceneObjectsDefaults";
import {ConvertedArrangerObject} from "../../objects/converted/ConvertedArrangerObject";

export const convertArrangerToPlan = (sceneObjects: SceneObjectsState) => {
    return sceneObjects.placedObjects.map(po => new ConvertedArrangerObject(po));
};
