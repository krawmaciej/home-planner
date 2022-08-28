import {
    Color,
    GridHelper,
    OrthographicCamera,
    Scene,
    Vector3,
    WebGLRenderer
} from "three";
import {ICameraHandler, OrthographicCameraHandler} from "../canvas/ICameraHandler";
import {MainInputHandler} from "../canvas/inputHandler/MainInputHandler";
import {WallThickness} from "../../drawer/objects/wall/WallThickness";
import {VoidIH} from "../canvas/inputHandler/VoidIH";
import { ObjectElevation} from "../../drawer/constants/Types";
import {SceneObjectsState} from "./SceneObjectsDefaults";

export type FloorPlanState = {
    cameraHandler: ICameraHandler,
    renderer: WebGLRenderer,
    mainInputHandler: MainInputHandler,
    wallThickness: WallThickness,
}

export const createCameraHandler = () => {
    return new OrthographicCameraHandler(new OrthographicCamera(0, 0, 0, 0, 0.1, 500), 18);
};

export const createMainInputHandler = () => {
    return new MainInputHandler(new VoidIH());
};

export const createRenderer = () => {
    return new WebGLRenderer({
        precision: "highp",
        antialias: true,
    });
};

export const createFloorPlanState = () => {
    return {
        cameraHandler: createCameraHandler(),
        renderer: createRenderer(),
        mainInputHandler: createMainInputHandler(),
        wallThickness: new WallThickness(1.0),
    } as FloorPlanState;
};

export const initializeFloorPlan = (scene: Scene, { cameraHandler }: FloorPlanState) => {
    scene.background = new Color(0x999999);

    const grid = new GridHelper(100, 100, 0xbbbbbb, 0xbbbbbb);
    grid.position.setY(ObjectElevation.GRID);
    scene.add(grid);

    cameraHandler.setPosition(new Vector3(0.0, 5.0, 0.0)); // todo: move floor plan to state
    cameraHandler.setLookAt(new Vector3(0.0, 0.0, 0.0));
};

export const clearScene = (scene: Scene, sceneObjectsState: SceneObjectsState) => {
    sceneObjectsState.placedWalls.forEach(wall => wall.removeFrom(scene));
    sceneObjectsState.wallComponents.forEach(component => component.removeFrom(scene));
};
