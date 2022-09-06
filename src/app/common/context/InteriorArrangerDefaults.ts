import {AmbientLight, HemisphereLight} from "three";
import {CanvasState} from "./CanvasDefaults";
import {InteriorArrangerState} from "../../../App";

export const initializeWithInteriorArranger = ({ scene }: CanvasState, interiorArrangerState: InteriorArrangerState) => {
    scene.add(interiorArrangerState.cameraHandler.getCamera()); // to add camera's light into the scene

    const ambientLight = new AmbientLight( 0xffffff );
    scene.add(ambientLight);

    const hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.1);
    hemiLight.position.set(0, -2, 0);
    scene.add(hemiLight);
};
