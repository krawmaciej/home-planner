import spinner from "./loading-spinner.gif";

import React, {useEffect, useState} from "react";
import {MainComponent} from "./app/MainComponent";
import {GridHelper, OrthographicCamera, PerspectiveCamera, PointLight, Vector3, WebGLRenderer} from "three";
import {OrthographicCameraHandler, PerspectiveCameraHandler} from "./app/common/canvas/ICameraHandler";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import {CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";
import {ObjectElevation} from "./app/drawer/constants/Types";

export type FloorPlanState = {
    cameraHandler: OrthographicCameraHandler,
    orbitControls: OrbitControls,
    grid: GridHelper,
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

const createLabelRenderer = () => {
    return new CSS2DRenderer();
};

const INITIAL_ZOOM = 0.6;

const DEFAULT_GRID_SIZE = 500;
const DEFAULT_GRID_DIVISIONS = 500;
export const DEFAULT_GRID = new GridHelper(DEFAULT_GRID_SIZE, DEFAULT_GRID_DIVISIONS, 0xbbbbbb, 0xbbbbbb);
DEFAULT_GRID.position.setY(ObjectElevation.GRID);

const LESS_FREQUENT_GRID_DIVISIONS = 250;
export const LESS_FREQUENT_GRID = new GridHelper(DEFAULT_GRID_SIZE, LESS_FREQUENT_GRID_DIVISIONS, 0xbbbbbb, 0xbbbbbb);
LESS_FREQUENT_GRID.position.setY(ObjectElevation.GRID);

const initialFloorPlanState = (labelRenderer: CSS2DRenderer): FloorPlanState => {
    const cameraHandler = new OrthographicCameraHandler(new OrthographicCamera(0, 0, 0, 0, 0.1, 500), 18);
    cameraHandler.setPosition(new Vector3(0.0, 5.0, 0.0));
    cameraHandler.setLookAt(new Vector3(0.0, 0.0, 0.0));
    cameraHandler.setZoom(INITIAL_ZOOM);

    const orbitControls = new OrbitControls(cameraHandler.getCamera(), labelRenderer.domElement);
    orbitControls.enableRotate = false;
    return {
        cameraHandler,
        orbitControls,
        grid: DEFAULT_GRID,
    };
};

const initialInteriorArrangerState = (labelRenderer: CSS2DRenderer): InteriorArrangerState => {
    const cameraLight = new PointLight(0xffffff, 0.3);
    const cameraHandler = new PerspectiveCameraHandler(new PerspectiveCamera(50), cameraLight, Math.PI);
    cameraHandler.setPosition(new Vector3(0, 50, 20));
    cameraHandler.setLookAt(new Vector3(0.0, 0.0, 0.0));
    cameraHandler.setZoom(INITIAL_ZOOM);

    const orbitControls = new OrbitControls(cameraHandler.getCamera(), labelRenderer.domElement);
    const transformControls = new TransformControls(cameraHandler.getCamera(), labelRenderer.domElement);
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
    const [labelRenderer] = useState(createLabelRenderer);
    const [floorPlanState, setFloorPlanState] = useState<FloorPlanState | undefined>();
    const [interiorArrangerState, setInteriorArrangerState] = useState<InteriorArrangerState | undefined>();

    useEffect(() => {
        setFloorPlanState(initialFloorPlanState(labelRenderer));
        setInteriorArrangerState(initialInteriorArrangerState(labelRenderer));
    }, [renderer]);

    if (floorPlanState === undefined || interiorArrangerState === undefined) {
        return (<div><img src={spinner} alt="loading"/></div>);
    }

    return (
        <MainComponent
            renderer={renderer}
            labelRenderer={labelRenderer}
            floorPlanState={floorPlanState}
            interiorArrangerState={interiorArrangerState}
        />
    );
};
