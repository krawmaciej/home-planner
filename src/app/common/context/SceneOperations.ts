import {Object3D, Scene, Texture, WebGLRenderer} from "three";
import {ISceneObject} from "../../drawer/objects/ISceneObject";

type TraverseObject = {
    geometry?: {
        dispose?: () => void,
    },
    material?: {
        dispose?: () => void,
        texture?: Texture,
    }[] | {
        dispose?: () => void,
        texture?: Texture,
    },
}

export const disposeAllProperties = (o: Object3D) => {
    const object = o as TraverseObject;

    object?.geometry?.dispose?.();

    if (Array.isArray(object?.material)) {
        for (let i = 0; i < object?.material?.length; ++i) {
            object?.material[i]?.texture?.dispose();
            object?.material[i]?.dispose?.();
        }
    } else {
        object?.material?.texture?.dispose();
        object?.material?.dispose?.();
    }
};

export const disposeSceneObjects = (scene: Scene, renderer: WebGLRenderer, sceneObjects = new Array<ISceneObject>()) => {
    const objectsToRemove = new Array<Object3D<any>>();
    scene.traverse(o => {
        if (o === scene) {
            return; // don't remove scene from scene
        }
        disposeAllProperties(o);
        objectsToRemove.push(o);
    });
    scene.remove(...objectsToRemove);
    sceneObjects.forEach(so => so.removeLabel());
    renderer.renderLists.dispose();
};
