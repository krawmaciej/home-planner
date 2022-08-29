import {
    Color,
    GridHelper,
    OrthographicCamera,
    Vector3,
    WebGLRenderer
} from "three";
import {OrthographicCameraHandler} from "../canvas/ICameraHandler";
import { ObjectElevation} from "../../drawer/constants/Types";
import {CanvasState} from "./CanvasDefaults";

export type FloorPlanState = {
    camera: OrthographicCameraHandler,
}

export const createFloorPlanState = (): FloorPlanState => {
    return {
        camera: createCameraHandler(),
    };
};

export const createCameraHandler = () => {
    console.log("I've broken camera handler");
    return new OrthographicCameraHandler(new OrthographicCamera(0, 0, 0, 0, 0.1, 500), 18);
};

export const createRenderer = () => {
    return new WebGLRenderer({
        precision: "highp",
        antialias: true,
    });
};

export const initializeWithFloorPlan = (canvasState: CanvasState) => {
    canvasState.scene.background = new Color(0x999999);

    const grid = new GridHelper(100, 100, 0xbbbbbb, 0xbbbbbb);
    grid.position.setY(ObjectElevation.GRID);
    canvasState.scene.add(grid);

    canvasState.mainCameraHandler.setPosition(new Vector3(0.0, 5.0, 0.0)); // todo: move floor plan to state
    canvasState.mainCameraHandler.setLookAt(new Vector3(0.0, 0.0, 0.0));
    console.log("set positions and all on floor", canvasState);
};
