import {
    ACESFilmicToneMapping, AmbientLight, Camera,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer,
} from "three";
import {PerspectiveCameraHandler} from "../canvas/ICameraHandler";
import {SceneObjectsState} from "./SceneObjectsDefaults";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import {CanvasState} from "./CanvasDefaults";
import {MainCameraHandler} from "../MainCameraHandler";

export type InteriorArrangerState = {
    camera: PerspectiveCameraHandler,
    orbitControls: OrbitControls,
    transformControls: TransformControls,
}

export const createInteriorArrangerState = (renderer: WebGLRenderer): InteriorArrangerState => {
    const camera = createCameraHandler();
    return {
        camera: camera,
        orbitControls: createOrbitControls(camera.getCamera(), renderer.domElement),
        transformControls: createTransformControls(camera.getCamera(), renderer.domElement),
    };
};

export const createCameraHandler = () => {
    return new PerspectiveCameraHandler(new PerspectiveCamera(50), Math.PI);
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
