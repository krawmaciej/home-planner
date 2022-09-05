import {AmbientLight, DirectionalLight, HemisphereLight} from "three";
import {CanvasState} from "./CanvasDefaults";
import {InteriorArrangerState} from "../../../App";

export const initializeWithInteriorArranger = ({ scene }: CanvasState, interiorArrangerState: InteriorArrangerState) => {
    scene.add(interiorArrangerState.cameraHandler.getCamera()); // to add point light into the scene

    const ambientLight = new AmbientLight( 0xffffff );
    scene.add(ambientLight);

    const dl1 = new DirectionalLight(0xffffff, 1);
    dl1.position.set(30, 50, 0);
    dl1.castShadow = true;
    // scene.add(dl1);

    const dl2 = new DirectionalLight(0xffffff, 1);
    dl2.position.set(0, 50, -30);
    dl2.castShadow = true;
    // scene.add(dl2);

    const hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.position.set(0, 10, 0);
    // scene.add(hemiLight);
};
