import {AmbientLight} from "three";
import {CanvasState} from "./CanvasDefaults";
import {InteriorArrangerState} from "../../../App";

export const initializeWithInteriorArranger = ({ scene }: CanvasState, interiorArrangerState: InteriorArrangerState) => {
    scene.add(interiorArrangerState.cameraHandler.getCamera()); // to add camera's light into the scene

    const ambientLight = new AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);
};
