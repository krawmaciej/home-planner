import spinner from "./loading-spinner.gif";

import React, {useEffect, useState} from "react";
import {MainComponent} from "./app/MainComponent";
import {OrthographicCamera, PerspectiveCamera, PointLight, Vector3, WebGLRenderer} from "three";
import {OrthographicCameraHandler, PerspectiveCameraHandler} from "./app/common/canvas/ICameraHandler";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";

export type FloorPlanState = {
    cameraHandler: OrthographicCameraHandler,
}

export type InteriorArrangerState = {
    cameraHandler: PerspectiveCameraHandler,
    orbitControls: OrbitControls,
    transformControls: TransformControls,
}

const createRenderer = () => {
    return new WebGLRenderer({
        precision: "highp",
        antialias: true,
    });
};

const initialFloorPlanState = (): FloorPlanState => {
    const cameraHandler = new OrthographicCameraHandler(new OrthographicCamera(0, 0, 0, 0, 0.1, 500), 18);
    cameraHandler.setPosition(new Vector3(0.0, 5.0, 0.0)); // todo: move floor plan to state
    cameraHandler.setLookAt(new Vector3(0.0, 0.0, 0.0));
    return {
        cameraHandler,
    };
};

const initialInteriorArrangerState = (renderer: WebGLRenderer): InteriorArrangerState => {
    const cameraLight = new PointLight(0xffffff, 0.3);
    const cameraHandler = new PerspectiveCameraHandler(new PerspectiveCamera(50), cameraLight, Math.PI);
    cameraHandler.setPosition(new Vector3(0, 50, 20));
    cameraHandler.setLookAt(new Vector3(0.0, 0.0, 0.0));

    const orbitControls = new OrbitControls(cameraHandler.getCamera(), renderer.domElement);
    const transformControls = new TransformControls(cameraHandler.getCamera(), renderer.domElement);
    transformControls.addEventListener("dragging-changed", event => {
        orbitControls.enabled = !event.value;
    });
    transformControls.enabled = false;
    return {
        cameraHandler,
        orbitControls,
        transformControls,
    };
};

export const App: React.FC = () => {

    const [renderer] = useState(createRenderer);
    const [floorPlanState, setFloorPlanState] = useState<FloorPlanState | undefined>();
    const [interiorArrangerState, setInteriorArrangerState] = useState<InteriorArrangerState | undefined>();

    useEffect(() => {
        setFloorPlanState(initialFloorPlanState());
        setInteriorArrangerState(initialInteriorArrangerState(renderer));
    }, [renderer]);

    if (floorPlanState === undefined || interiorArrangerState === undefined) {
        return (<div><img src={spinner} alt="loading"/></div>);
    }

    return (
        <MainComponent
            renderer={renderer}
            floorPlanState={floorPlanState}
            interiorArrangerState={interiorArrangerState}
        />
    );
};
