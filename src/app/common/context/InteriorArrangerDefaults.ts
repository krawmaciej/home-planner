import {
    ACESFilmicToneMapping, AmbientLight, Camera,
    Scene,
    Vector3,
    WebGLRenderer,
} from "three";
import {SceneObjectsState} from "./SceneObjectsDefaults";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import {CanvasState} from "./CanvasDefaults";
import {PerspectiveCameraHandler} from "../canvas/ICameraHandler";

export type InteriorArrangerState = {
    orbitControls: OrbitControls,
    transformControls: TransformControls,
}

export const createInteriorArrangerState = (camera: Camera, renderer: WebGLRenderer): InteriorArrangerState => {
    return {
        orbitControls: createOrbitControls(camera, renderer.domElement),
        transformControls: createTransformControls(camera, renderer.domElement),
    };
};

export const createOrbitControls = (camera: Camera, domElement: HTMLElement) => {
    return new OrbitControls(camera, domElement);
};

export const createTransformControls = (camera: Camera, domElement: HTMLElement) => {
    const transformControls = new TransformControls(camera, domElement);
    transformControls.enabled = false;
    return transformControls;
};

const updateRenderer = (renderer: WebGLRenderer) => {
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    // renderer.outputEncoding = sRGBEncoding;
};

export const initializeWithInteriorArranger = ({ scene }: CanvasState, cameraHandler: PerspectiveCameraHandler) => {
    const light = new AmbientLight( 0xffffff ); // soft white light
    scene.add(light);

    cameraHandler.setPosition(new Vector3(0, 50, 20));
    cameraHandler.setLookAt(new Vector3(0.0, 0.0, 0.0));
};

export const clearScene = (scene: Scene, sceneObjectsState: SceneObjectsState) => {
    sceneObjectsState.placedWalls.forEach(wall => wall.removeFrom(scene));
    sceneObjectsState.wallComponents.forEach(component => component.removeFrom(scene));
};
