import {Scene} from "three";
import {MainInputHandler} from "../canvas/inputHandler/MainInputHandler";

export type CanvasState = {
    scene: Scene,
    mainInputHandler: MainInputHandler,
}

export const createCanvasState = (): CanvasState => {
    return {
        scene: new Scene(),
        mainInputHandler: new MainInputHandler(),
    };
};
