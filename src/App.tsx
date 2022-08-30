import React, {useEffect, useState} from "react";
import {MainComponent} from "./app/MainComponent";
import {OrthographicCamera, PerspectiveCamera, Vector3, WebGLRenderer} from "three";
import {OrthographicCameraHandler, PerspectiveCameraHandler} from "./app/common/canvas/ICameraHandler";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export const createRenderer = () => {
    return new WebGLRenderer({
        precision: "highp",
        antialias: true,
    });
};

export const createOrthographicHandler = () => {
    console.log("I've broken camera handler");
    return new OrthographicCameraHandler(new OrthographicCamera(0, 0, 0, 0, 0.1, 500), 18);
};

export const createPerspectiveHandler = () => {
    return new PerspectiveCameraHandler(new PerspectiveCamera(50), Math.PI);
};

export const defaultOrthographicSetup = (orthographicHandler: OrthographicCameraHandler) => {
    orthographicHandler.setPosition(new Vector3(0.0, 5.0, 0.0)); // todo: move floor plan to state
    orthographicHandler.setLookAt(new Vector3(0.0, 0.0, 0.0));
};

export const defaultPerspectiveSetup = (perspectiveHandler: PerspectiveCameraHandler) => {
    perspectiveHandler.setPosition(new Vector3(0, 50, 20));
    perspectiveHandler.setLookAt(new Vector3(0.0, 0.0, 0.0));
};

export const App: React.FC = () => {

    const [renderer] = useState(createRenderer);
    const [orthographicHandler] = useState(createOrthographicHandler);
    const [perspectiveHandler] = useState(createPerspectiveHandler);

    useEffect(() => {
        defaultOrthographicSetup(orthographicHandler);
    }, [orthographicHandler]);

    useEffect(() => {
        defaultPerspectiveSetup(perspectiveHandler);
        new OrbitControls(perspectiveHandler.getCamera(), renderer.domElement);
    }, [perspectiveHandler]);

    return (
        <MainComponent
            renderer={renderer}
            floorPlanCameraHandler={orthographicHandler}
            interiorArrangerCameraHandler={perspectiveHandler}
        />
    );
};
