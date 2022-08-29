import {
    ACESFilmicToneMapping, AmbientLight, Camera,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer,
} from "three";
import {PerspectiveCameraHandler} from "../canvas/ICameraHandler";
import {MainInputHandler} from "../canvas/inputHandler/MainInputHandler";
import {VoidIH} from "../canvas/inputHandler/VoidIH";
import {SceneObjectsState} from "./SceneObjectsDefaults";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import {CanvasState} from "./CanvasDefaults";
import {MainCameraHandler} from "../MainCameraHandler";

export type InteriorArrangerState = {
    orbitControls: OrbitControls,
    transformControls: TransformControls,
}

export const createCameraHandler = () => {
    return new PerspectiveCameraHandler(new PerspectiveCamera(50), Math.PI);
};

export const createInputHandler = () => {
    return new VoidIH();
};

export const createOrbitControls = (camera: Camera, domElement: HTMLElement) => {
    return new OrbitControls(camera, domElement);
};

export const createTransformControls = (camera: Camera, domElement: HTMLElement) => {
    return new TransformControls(camera, domElement);
};

const updateRenderer = (renderer: WebGLRenderer) => {
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    // renderer.outputEncoding = sRGBEncoding;
};

const updateCameraHandler = (mainCameraHandler: MainCameraHandler) => {
    mainCameraHandler.changeHandler(createCameraHandler());
};

const updateInputHandler = (mainInputHandler: MainInputHandler) => {
    mainInputHandler.changeHandlingStrategy(createInputHandler());
};

export const updateWithInteriorArranger = (canvasState: CanvasState) => {
    updateRenderer(canvasState.renderer);
    updateCameraHandler(canvasState.mainCameraHandler);
    updateInputHandler(canvasState.mainInputHandler);
};

export const createInteriorArrangerState = ({renderer, mainCameraHandler}: CanvasState): InteriorArrangerState => {
    return {
        orbitControls: createOrbitControls(mainCameraHandler.getCamera(), renderer.domElement),
        transformControls: createTransformControls(mainCameraHandler.getCamera(), renderer.domElement),
    };
};

export const initializeWithInteriorArranger = (canvasState: CanvasState) => {
    const light = new AmbientLight( 0xffffff ); // soft white light
    canvasState.scene.add(light);

    canvasState.mainCameraHandler.setPosition(new Vector3(0, 50, 20));
    canvasState.mainCameraHandler.setLookAt(new Vector3(0.0, 0.0, 0.0));
};

export const clearScene = (scene: Scene, sceneObjectsState: SceneObjectsState) => {
    sceneObjectsState.placedWalls.forEach(wall => wall.removeFrom(scene));
    sceneObjectsState.wallComponents.forEach(component => component.removeFrom(scene));
};
