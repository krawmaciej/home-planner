import {AmbientLight} from "three";
import {CanvasState} from "./CanvasDefaults";

export const initializeWithInteriorArranger = ({ scene }: CanvasState) => {
    const light = new AmbientLight( 0xffffff ); // soft white light
    scene.add(light);
};
