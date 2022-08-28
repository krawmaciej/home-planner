import {
    ACESFilmicToneMapping, AmbientLight, Camera,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer,
    WebGLRendererParameters
} from "three";
import {ICameraHandler, PerspectiveCameraHandler} from "../canvas/ICameraHandler";
import {MainInputHandler} from "../canvas/inputHandler/MainInputHandler";
import {VoidIH} from "../canvas/inputHandler/VoidIH";
import {SceneObjectsState} from "./SceneObjectsDefaults";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";

export type InteriorArrangerState = {
    cameraHandler: ICameraHandler,
    renderer: WebGLRenderer,
    mainInputHandler: MainInputHandler,
    orbitControls: OrbitControls,
    transformControls: TransformControls,
}

export const createCameraHandler = () => {
    return new PerspectiveCameraHandler(new PerspectiveCamera(50), Math.PI);
};

export const createMainInputHandler = () => {
    return new MainInputHandler(new VoidIH());
};

export const createRenderer = () => {
    const rendererParams: WebGLRendererParameters = {
        precision: "highp",
        antialias: true,
    };
    const webGLRenderer = new WebGLRenderer(rendererParams);
    webGLRenderer.toneMapping = ACESFilmicToneMapping;
    webGLRenderer.toneMappingExposure = 1;
    // webGLRenderer.outputEncoding = sRGBEncoding;
    return webGLRenderer;
};

export const createOrbitControls = (camera: Camera, domElement: HTMLElement) => {
    return new OrbitControls(camera, domElement);
};

export const createTransformControls = (camera: Camera, domElement: HTMLElement) => {
    return new TransformControls(camera, domElement);
};

export const createInteriorArrangerState = (): InteriorArrangerState => {
    const cameraHandler = createCameraHandler();
    const renderer = createRenderer();
    return {
        cameraHandler: cameraHandler,
        renderer: renderer,
        mainInputHandler: createMainInputHandler(),
        orbitControls: createOrbitControls(cameraHandler.getCamera(), renderer.domElement),
        transformControls: createTransformControls(cameraHandler.getCamera(), renderer.domElement),
    };
};

export const initializeInteriorArrangerState = (scene: Scene, { cameraHandler }: InteriorArrangerState) => {
    const light = new AmbientLight( 0xffffff ); // soft white light
    scene.add(light);

    cameraHandler.setPosition(new Vector3(0, 50, 20));
    cameraHandler.setLookAt(new Vector3(0.0, 0.0, 0.0));
};

export const clearScene = (scene: Scene, sceneObjectsState: SceneObjectsState) => {
    sceneObjectsState.placedWalls.forEach(wall => wall.removeFrom(scene));
    sceneObjectsState.wallComponents.forEach(component => component.removeFrom(scene));
};
