import {
    Color,
    GridHelper,
    WebGLRenderer
} from "three";
import {OrthographicCameraHandler} from "../canvas/ICameraHandler";
import { ObjectElevation} from "../../drawer/constants/Types";
import {CanvasState} from "./CanvasDefaults";

export type FloorPlanState = {
    camera: OrthographicCameraHandler,
}

export const createRenderer = () => {
    return new WebGLRenderer({
        precision: "highp",
        antialias: true,
    });
};

export const initializeWithFloorPlan = ({ scene }: CanvasState) => {
    scene.background = new Color(0x999999);

    const grid = new GridHelper(100, 100, 0xbbbbbb, 0xbbbbbb);
    grid.position.setY(ObjectElevation.GRID);
    scene.add(grid);
};
