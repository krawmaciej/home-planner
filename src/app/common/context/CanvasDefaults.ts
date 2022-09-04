import {Scene} from "three";
import {MainInputHandler} from "../canvas/inputHandler/MainInputHandler";
import {ICanvasObserver} from "../canvas/ICanvasObserver";

export type CanvasState = {
    scene: Scene,
    mainInputHandler: MainInputHandler,
    observers: Array<ICanvasObserver>,
}

export const createCanvasState = (): CanvasState => {
    return {
        scene: new Scene(),
        mainInputHandler: new MainInputHandler(),
        observers: new Array<ICanvasObserver>(),
    };
};
