import React, {useState} from "react";
import {MainComponent} from "./app/MainComponent";
import {OrthographicCamera, PerspectiveCamera, WebGLRenderer} from "three";
import {OrthographicCameraHandler, PerspectiveCameraHandler} from "./app/common/canvas/ICameraHandler";

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

export const App: React.FC = () => {

    const [renderer] = useState(createRenderer);
    const [orthographicHandler] = useState(createOrthographicHandler);
    const [perspectiveHandler] = useState(createPerspectiveHandler);

    return (
        <MainComponent
            renderer={renderer}
            floorPlanCameraHandler={orthographicHandler}
            interiorArrangerCameraHandler={perspectiveHandler}
        />
    );
};
