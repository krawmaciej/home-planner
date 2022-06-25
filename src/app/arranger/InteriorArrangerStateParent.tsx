import "../css/MainStyle.css";

import React, {useEffect, useRef, useState} from 'react';

import {
    ACESFilmicToneMapping,
    AmbientLight, Mesh, MeshStandardMaterial, Object3D,
    PerspectiveCamera,
    Scene,
    Vector3, WebGLRenderer,
    WebGLRendererParameters
} from 'three';
import { InteriorArrangerMainController } from "./controllers/InteriorArrangerMainController";
import { MainInputHandler } from "../common/canvas/inputHandler/MainInputHandler";
import { VoidIH } from "../common/canvas/inputHandler/VoidIH";
import {ICameraHandler, PerspectiveCameraHandler} from "../common/canvas/ICameraHandler";
import {Canvas} from "../common/canvas/Canvas";
import {SceneObjectsState} from "../common/context/SceneObjectsDefaults";
import {PlanToArrangerConverter} from "./components/PlanToArrangerConverter";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

type Props = {
    className?: string,
    sceneObjects: SceneObjectsState,
}

function traverseChildren(children: Object3D[]) {
    if (!children) {
        return;
    }
    children.forEach(child => {
        if (child instanceof Mesh) {
            if (child.material instanceof MeshStandardMaterial) {
                child.material.flatShading = true;
            }
            // if (child.material instanceof MeshStandardMaterial) {
            //     if (!child.material.metalnessMap) {
            //         child.material.metalness = 0;
            //     }
            //     if (!child.material.aoMap) {
            //         child.material.aoMapIntensity = 0;
            //     }
            //     if (!child.material.bumpMap) {
            //         child.material.bumpScale = 0;
            //     }
            //     if (!child.material.displacementMap) {
            //         child.material.displacementScale = 0;
            //     }
            //     if (!child.material.emissiveMap) {
            //         child.material.emissiveIntensity = 0;
            //     }
            //     if (!child.material.envMap) {
            //         child.material.envMapIntensity = 0;
            //     }
            //     if (!child.material.lightMap) {
            //         child.material.lightMapIntensity = 0;
            //     }
            //     if (!child.material.normalMap) {
            //         child.material.normalScale = new Vector2(1, 1);
            //     }
            //     if (!child.material.roughnessMap) {
            //         child.material.roughness = 0;
            //     }
            //     if (!child.material.map) {
            //         child.material.lightMapIntensity = 0;
            //     }
            // }
        }
        traverseChildren(child.children);
    });
}

function createBetterWebGLRenderer(rendererParams: WebGLRendererParameters) {
    const webGLRenderer = new WebGLRenderer(rendererParams);
    webGLRenderer.toneMapping = ACESFilmicToneMapping;
    webGLRenderer.toneMappingExposure = 1;
    // webGLRenderer.outputEncoding = sRGBEncoding;
    return webGLRenderer;
}

export const InteriorArrangerStateParent: React.FC<Props> = ({ sceneObjects }: Props) => {

    const [scene] = useState<Scene>(new Scene()); // new scene is created on component reload

    const [zoom, setZoom] = useState<number>(0.6);

    const { current: cameraHandler } = useRef<ICameraHandler>(
        new PerspectiveCameraHandler(new PerspectiveCamera(50), Math.PI)
    );
    const { current: planObjectsConverter } = useRef<PlanToArrangerConverter>(new PlanToArrangerConverter());
    const mainInputHandler: MainInputHandler = new MainInputHandler(new VoidIH());
    const rendererParams: WebGLRendererParameters = {
        precision: "highp",
        antialias: true,
    };

    const { current: renderer } = useRef<WebGLRenderer>(createBetterWebGLRenderer(rendererParams));
    const { current: controls } = useRef<OrbitControls>(new OrbitControls(cameraHandler.getCamera(), renderer.domElement));

    const setCameraZoomHandler = (zoom: number) => {
        cameraHandler.setZoom(zoom);
        setZoom(zoom);
    };

    useEffect(() => {
        // const hemiLight = new HemisphereLight("white", "grey");
        // const directLight = new DirectionalLight("white", 1);
        // directLight.position.set(0, 40, 20);
        // directLight.target.position.set(0, 0, 0);
        //
        // scene.add(directLight);

        const light = new AmbientLight( 0xffffff ); // soft white light
        scene.add(light);

        cameraHandler.setPosition(new Vector3(0, 50, 20));
        cameraHandler.setLookAt(new Vector3(0.0, 0.0, 0.0));
        cameraHandler.setZoom(zoom);

        // todo: return stuff that's to be inserted into map which will be held as state in this component.
        const temp = planObjectsConverter.convertPlanObjects(sceneObjects);

        const wallFaceMeshes = [...temp.sceneWallFaceMeshes.meshToWallFaceMap.keys()];

        const allMeshes = [
            ...wallFaceMeshes,
            ...temp.wallCoverMeshes,
            ...temp.sceneComponentFramesMeshes,
            ...temp.sceneFloorsMeshes,
            ...temp.sceneCeilingsMeshes,
        ];

        // allMeshes.forEach(mesh => {
        //     mesh.receiveShadow = true;
        //     mesh.castShadow = true;
        // });

        scene.add(...allMeshes);

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
        gltfLoader.loadAsync('/doors/InteriorDoor.gltf').then(gltf => {
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

            gltf.scene.children.forEach(child => {
                child.scale.multiplyScalar(10);
            });
            console.log("Scene", gltf.scene);
            scene.add(gltf.scene);
        });
    }, [sceneObjects]);

    return (
        <>
            <Canvas scene={scene} renderer={renderer} controls={controls} cameraHandler={cameraHandler} mainInputHandler={mainInputHandler}/>
            <InteriorArrangerMainController className={"app-bottom-menu"} scene={scene} mainInputHandler={mainInputHandler}/>
        </>
    );
};
