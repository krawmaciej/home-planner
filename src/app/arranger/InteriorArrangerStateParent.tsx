import "../css/MainStyle.css";

import React, {useEffect, useRef, useState} from 'react';

import {
    ACESFilmicToneMapping,
    AmbientLight, Box3, Box3Helper, Color, Group, Mesh, Object3D,
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
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {Geometry} from "three/examples/jsm/deprecated/Geometry";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

type Props = {
    className?: string,
    sceneObjects: SceneObjectsState,
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

    const { current: renderer } = useRef(createBetterWebGLRenderer(rendererParams));
    const { current: orbit } = useRef(new OrbitControls(cameraHandler.getCamera(), renderer.domElement));
    const { current: transform } = useRef(new TransformControls(cameraHandler.getCamera(), renderer.domElement));

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
            ...temp.sceneComponents.models,
            ...temp.sceneComponents.frames,
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
        gltfLoader.loadAsync('/doors/offset_pos_door/door.gltf').then(gltf => {
            const group = new Group();
            group.add(gltf.scene);
            scene.add(group);
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
            scene.add(box3Helper);

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
            scene.add(box3Helper2);

            gltf.scene.position.sub(center);



            //gltf.scene.position.copy(center);


            gltf.scene.traverse((obj) => {
                console.log(obj.position);
            });
            // scene.add(box3Helper);

            // const scene2 = gltf.scene.clone();
            // scene2.applyMatrix4(new Matrix4().makeScale(-1, 1, 1));

            // scene.add(scene2);

            transform.attach(group);
            scene.add(transform);
        });
    }, [sceneObjects]);

    return (
        <>
            <Canvas scene={scene} renderer={renderer} cameraHandler={cameraHandler} mainInputHandler={mainInputHandler}/>
            <InteriorArrangerMainController className={"app-bottom-menu"} scene={scene} mainInputHandler={mainInputHandler}/>
        </>
    );
};

const findGeometries = (object: Object3D) => {
    const geometries = new Array<Geometry>();
    if (object instanceof Mesh) {
        geometries.push(object.geometry);
    }
    return geometries;
};
