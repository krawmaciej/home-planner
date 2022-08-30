import {Scene} from "three";
import {MainCameraHandler} from "../MainCameraHandler";
import {MainInputHandler} from "../canvas/inputHandler/MainInputHandler";
import {FloorPlanState} from "../../../App";

export type CanvasState = {
    scene: Scene,
    mainCameraHandler: MainCameraHandler,
    mainInputHandler: MainInputHandler,
}

export const createCanvasState = (state: FloorPlanState): CanvasState => {
    return {
        scene: new Scene(), // todo: keep it simple, have state for both floorplan and interior arranger here
        mainCameraHandler: new MainCameraHandler(state.cameraHandler), // todo: initialize all domy/renderer stuff in canvas
        mainInputHandler: new MainInputHandler(),
    };
};
