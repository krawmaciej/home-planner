import "../css/MainStyle.css";

import React, {useEffect, useRef, useState} from 'react';

import {
    AmbientLight,
    DirectionalLight,
    HemisphereLight,
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

type Props = {
    className?: string,
    sceneObjects: SceneObjectsState,
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

    const { current: renderer } = useRef<WebGLRenderer>(new WebGLRenderer(rendererParams));
    const { current: controls } = useRef<OrbitControls>(new OrbitControls(cameraHandler.getCamera(), renderer.domElement));

    const setCameraZoomHandler = (zoom: number) => {
        cameraHandler.setZoom(zoom);
        setZoom(zoom);
    };

    useEffect(() => {
        const hemiLight = new HemisphereLight("white", "grey", 0.5);
        const directLight = new DirectionalLight("white", 0.4);
        directLight.position.set(0, 30, 10);
        directLight.target.position.set(0, 0, 10);

        scene.add(hemiLight, directLight);

        const light = new AmbientLight( 0x808080 ); // soft white light
        scene.add(light);

        cameraHandler.setPosition(new Vector3(0, 50, 20));
        cameraHandler.setLookAt(new Vector3(0.0, 0.0, 0.0));
        cameraHandler.setZoom(zoom);

        // todo: return stuff that's to be inserted into map which will be held as state in this component.
        const temp = planObjectsConverter.convertPlanObjects(sceneObjects);

        const wallFaceMeshes = [...temp.sceneWallFaceMeshes.meshToWallFaceMap.keys()];
        scene.add(...wallFaceMeshes);
        scene.add(...temp.wallCoverMeshes);
        scene.add(...temp.sceneComponentFramesMeshes);
        scene.add(...temp.sceneFloorsMeshes);
        scene.add(...temp.sceneCeilingsMeshes);
        // scene.add(meshes[0]);
        // scene.add(meshes[1]);
        // scene.add(meshes[2]);
        // scene.add(meshes[3]);
        // temp.meshToWallFaceMap.forEach(val => scene.add(val.mesh));
        // scene.add(...temp.meshes()); // todo: might need to use [] around ...temp.meshes
    }, [sceneObjects]);

    return (
        <>
            <Canvas scene={scene} renderer={renderer} controls={controls} cameraHandler={cameraHandler} mainInputHandler={mainInputHandler}/>
            <InteriorArrangerMainController className={"app-bottom-menu"} scene={scene} mainInputHandler={mainInputHandler}/>
        </>
    );
};
