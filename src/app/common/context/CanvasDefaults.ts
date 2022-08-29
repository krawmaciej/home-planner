import {Scene, WebGLRenderer} from "three";
import {MainCameraHandler} from "../MainCameraHandler";
import {NoCameraHandler} from "../canvas/ICameraHandler";
import {MainInputHandler} from "../canvas/inputHandler/MainInputHandler";
import {VoidIH} from "../canvas/inputHandler/VoidIH";

export type CanvasState = {
    scene: Scene,
    renderer: WebGLRenderer,
    mainCameraHandler: MainCameraHandler,
    mainInputHandler: MainInputHandler,
}

export const createCanvasState = (): CanvasState => {
    return {
        scene: new Scene(),
        renderer: new WebGLRenderer(),
        mainCameraHandler: new MainCameraHandler(new NoCameraHandler()),
        mainInputHandler: new MainInputHandler(new VoidIH()),
    };
};
