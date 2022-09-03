import "../css/MainStyle.css";

import React, {useEffect, useState} from 'react';
import {Box3, Box3Helper, Color, Group, Object3D, Vector3, WebGLRenderer} from 'three';
import {InteriorArrangerMainController} from "./controllers/InteriorArrangerMainController";
import {SceneObjectsState} from "../common/context/SceneObjectsDefaults";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {ObjectProps} from "./objects/ImportedObject";
import {PlanToArrangerConverter} from "./components/converter/PlanToArrangerConverter";
import {disposeSceneObjects} from "../common/context/SceneOperations";
import {CanvasState} from "../common/context/CanvasDefaults";
import {ICameraHandler} from "../common/canvas/ICameraHandler";
import spinner from "../../loading-spinner.gif";

type Props = {
    className?: string,
    renderer: WebGLRenderer,
    canvasState: CanvasState
    sceneObjects: SceneObjectsState,
    objectDefinitions: Array<ObjectProps>,
    cameraHandler: ICameraHandler,
}

export const InteriorArrangerStateParent: React.FC<Props> = ({ canvasState, sceneObjects, objectDefinitions, renderer, cameraHandler }) => {
    
    const [planObjectsConverter] = useState(new PlanToArrangerConverter());
    const [zoom, setZoom] = useState(0.6);

    const [immutableObjects, setImmutableObjects] = useState<Array<Object3D>>();
    const [walls, setWalls] = useState<Array<Object3D>>();
    const [wallFrames, setWallFrames] = useState<Array<Object3D>>();
    const [floors, setFloors] = useState<Array<Object3D>>();
    const [ceilings, setCeilings] = useState<Array<Object3D>>();

    const [, updatePlacedObjectsToggle] = useState(false);

    const setCameraZoomHandler = (zoom: number) => {
        cameraHandler.setZoom(zoom);
        setZoom(zoom);
    };

    useEffect(() => () => {
        console.log("interior arranger state on dismount");
        disposeSceneObjects(canvasState.scene, renderer);
    }, [sceneObjects, canvasState]);

    useEffect(() => {
        cameraHandler.setZoom(zoom);

        const temp = planObjectsConverter.convertPlanObjects(sceneObjects);

        const wallFaceMeshes = [...temp.sceneWallFaceMeshes.meshToWallFaceMap.keys()];

        const allMeshes = [
            ...wallFaceMeshes,
            ...temp.wallCoverMeshes,
            ...temp.sceneComponents.models,
            ...temp.sceneComponents.frames,
            ...temp.sceneFloorsMeshes,
            ...temp.sceneCeilingsMeshes,
            ...sceneObjects.placedObjects,
        ]; // todo: keep those meshes in state arrays, display spinner instead of menu until all loaded

        // allMeshes.forEach(mesh => {
        //     mesh.receiveShadow = true;
        //     mesh.castShadow = true;
        // });

        if (allMeshes.length > 0) {
            canvasState.scene.add(...allMeshes);
        }

        setImmutableObjects([...temp.wallCoverMeshes, ...temp.sceneComponents.models]);
        setWalls([...wallFaceMeshes]);
        setWallFrames([...temp.sceneComponents.frames]); // todo: hold some kind of maps, that will propagate changes from arranger into scene models, somehow
        setFloors([...temp.sceneFloorsMeshes]);
        setCeilings([...temp.sceneCeilingsMeshes]);



        // scene.add(...wallFaceMeshes);
        // scene.add(...temp.wallCoverMeshes);
        // scene.add(...temp.sceneComponentFramesMeshes);
        // scene.add(...temp.sceneFloorsMeshes);
        // scene.add(...temp.sceneCeilingsMeshes);
        // scene.add(meshes[0]);
        // scene.add(meshes[1]);
        // scene.add(meshes[2]);
        // scene.add(meshes[3]);
        // temp.meshToWallFaceMap.forEach(val => scene.add(val.mesh));
        // scene.add(...temp.meshes()); // todo: might need to use [] around ...temp.meshes


        // models tests
        const gltfLoader = new GLTFLoader();
        gltfLoader.loadAsync('/doors/offset_pos_door/door.gltf').then(gltf => {
            const group = new Group();
            group.add(gltf.scene);
            // scene.add(group);
            // door.scale.multiplyScalar(0.1);
            // door.children.forEach(child => {
            //     if (child instanceof Mesh) {
            //         // const material = DEFAULT_WALL_MATERIAL.clone();
            //         // material.side = DoubleSide;
            //         // child.material = material;
            //         console.log("door mesh material", child.material);
            //     }
            // });

            // traverseChildren(gltf.scene.children);

            // gltf.scene.children.forEach(child => {
            //     child.scale.multiplyScalar(10);
            // });
            gltf.scene.scale.multiplyScalar(0.2);
            // gltf.scene.position.set(5, 2, -4);

            const box3 = new Box3().setFromObject(gltf.scene);
            const boxNotModifiable = box3.clone();
            const box3Helper = new Box3Helper(boxNotModifiable, new Color(0xffff00));
            // scene.add(box3Helper);

            console.log("box3: ", box3);
            const min = box3.min.clone();
            console.log(min);
            console.log(box3.max);
            const center = boxNotModifiable.getCenter(new Vector3());
            console.log("box3 center: ", center);
            console.log("Scene position: ", gltf.scene.position);

            // temporarily move to global coordinate
            // while (!gltf.scene.parent);
            // gltf.scene?.parent?.localToWorld(gltf.scene.position);

            // rotate position
            gltf.scene.position.sub(center);
            gltf.scene.position.applyAxisAngle(new Vector3(0, 1, 0), Math.PI/2.0);
            gltf.scene.position.add(center);

            // rotate object
            gltf.scene.rotateOnAxis(new Vector3(0, 1, 0), Math.PI/2.0);

            // move back to local coordinate
            // gltf.scene?.parent?.worldToLocal(gltf.scene.position);




            const box3Helper2 = new Box3Helper(box3, new Color(0x00ff00));
            // scene.add(box3Helper2);

            gltf.scene.position.sub(center);



            //gltf.scene.position.copy(center);


            gltf.scene.traverse((obj) => {
                console.log(obj.position);
            });
            // scene.add(box3Helper);

            // const scene2 = gltf.scene.clone();
            // scene2.applyMatrix4(new Matrix4().makeScale(-1, 1, 1));

            // scene.add(scene2);

            // transform.attach(group);
            // scene.add(transform);
        });
    }, [sceneObjects, canvasState]);

    if (immutableObjects === undefined ||
        walls === undefined ||
        wallFrames === undefined ||
        floors === undefined ||
        ceilings === undefined
    ) {
        return (<div><img src={spinner} alt="loading"/></div>);
    }

    return (
        <>
            <InteriorArrangerMainController
                className={"app-bottom-menu"}
                scene={canvasState.scene}
                mainInputHandler={canvasState.mainInputHandler}
                objectDefinitions={objectDefinitions}
                placedObjects={sceneObjects.placedObjects}
                updatePlacedObjectsToggle={updatePlacedObjectsToggle}
            />
        </>
    );
};
