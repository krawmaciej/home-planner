import {AmbientLight} from "three";
import {CanvasState} from "./CanvasDefaults";

export const initializeWithInteriorArranger = ({ scene }: CanvasState) => {
    const light = new AmbientLight( 0xffffff );
    scene.add(light);
};
