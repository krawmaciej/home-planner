import {Object3D, Scene, WebGLRenderer} from "three";

type TraverseObject = {
    geometry?: {
        dispose?: () => void,
    },
    material?: {
        dispose?: () => void,
    }[] | {
        dispose?: () => void,
    },
}

export const disposeSceneObjects = (scene: Scene, renderer: WebGLRenderer) => {

    const objectsToRemove = new Array<Object3D<any>>();

    scene.traverse(o => {
        if (o === scene) {
            return; // don't remove scene from scene
        }

        const object = o as TraverseObject;

        object?.geometry?.dispose?.();

        if (Array.isArray(object?.material)) {
            for (let i = 0; i < object?.material?.length; ++i) {
                object?.material[i]?.dispose?.();
            }
        } else {
            object?.material?.dispose?.();
        }

        objectsToRemove.push(o);
    });

    console.log(objectsToRemove);
    scene.remove(...objectsToRemove);

    renderer.renderLists.dispose();
};