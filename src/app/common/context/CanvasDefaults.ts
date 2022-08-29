import {Scene} from "three";
import {MainCameraHandler} from "../MainCameraHandler";
import {ICameraHandler} from "../canvas/ICameraHandler";
import {MainInputHandler} from "../canvas/inputHandler/MainInputHandler";

export type CanvasState = {
    scene: Scene,
    mainCameraHandler: MainCameraHandler,
    mainInputHandler: MainInputHandler,
}

export const createCanvasState = (cameraHandler: ICameraHandler): CanvasState => {
    return {
        scene: new Scene(), // todo: keep it simple, have state for both floorplan and interior arranger here
        mainCameraHandler: new MainCameraHandler(cameraHandler), // todo: initialize all domy/renderer stuff in canvas
        mainInputHandler: new MainInputHandler(),
    };
};
