import {Scene} from "three";
import {MainCameraHandler} from "../MainCameraHandler";
import {NoCameraHandler} from "../canvas/ICameraHandler";
import {MainInputHandler} from "../canvas/inputHandler/MainInputHandler";
import {VoidIH} from "../canvas/inputHandler/VoidIH";

export type CanvasState = {
    scene: Scene,
    mainCameraHandler: MainCameraHandler,
    mainInputHandler: MainInputHandler,
}

export const createCanvasState = (): CanvasState => {
    return {
        scene: new Scene(), // todo: keep it simple, have state for both floorplan and interior arranger here
        mainCameraHandler: new MainCameraHandler(new NoCameraHandler()), // todo: initialize all domy/renderer stuff in canvas
        mainInputHandler: new MainInputHandler(new VoidIH()),
    };
};
