import {Color, Scene} from "three";
import {MainInputHandler} from "../canvas/inputHandler/MainInputHandler";
import {ICanvasObserver} from "../canvas/ICanvasObserver";

const SCENE_BACKGROUND_COLOR = new Color(0x999999);

export type CanvasState = {
    scene: Scene,
    mainInputHandler: MainInputHandler,
    observers: Array<ICanvasObserver>,
}

export const createCanvasState = (): CanvasState => {
    const scene = new Scene();
    scene.background = SCENE_BACKGROUND_COLOR;
    return {
        scene: scene,
        mainInputHandler: new MainInputHandler(),
        observers: new Array<ICanvasObserver>(),
    };
};
