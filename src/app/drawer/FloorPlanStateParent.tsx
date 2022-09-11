import "../css/MainStyle.css";

import React, {useEffect, useState} from 'react';

import {FloorPlanMainController} from "./controllers/FloorPlanMainController";
import {SceneObjectsState} from "../common/context/SceneObjectsDefaults";
import {ComponentProps} from "./objects/component/WallComponent";
import {disposeSceneObjects} from "../common/context/SceneOperations";
import {CanvasState} from "../common/context/CanvasDefaults";
import {WallThickness} from "./objects/wall/WallThickness";
import {WebGLRenderer} from "three";
import {ICameraHandler} from "../common/canvas/ICameraHandler";
import {addCurrentSceneObjects} from "./components/CurrentSceneObjectsAdder";
import {FloorPlanState} from "../../App";

type Props = {
    className?: string,
    renderer: WebGLRenderer,
    sceneObjects: SceneObjectsState,
    doorDefinitions: Array<ComponentProps>,
    windowDefinitions: Array<ComponentProps>,
    canvasState: CanvasState,
    cameraHandler: ICameraHandler,
    floorPlanState: FloorPlanState,
}

const INITIAL_ZOOM = 0.6;

export const FloorPlanStateParent: React.FC<Props> = ({ sceneObjects, doorDefinitions, windowDefinitions, canvasState, renderer, cameraHandler, floorPlanState }) => {

    const [wallThickness, setWallThickness] = useState(new WallThickness(1.0));

    useEffect(() => () => {
            disposeSceneObjects(canvasState.scene, renderer, [
                ...sceneObjects.floors,
                ...sceneObjects.wallComponents,
                ...sceneObjects.placedWalls,
            ]);
    }, [sceneObjects, canvasState]);

    useEffect(() => {
        cameraHandler.setZoom(INITIAL_ZOOM);
        addCurrentSceneObjects(sceneObjects, canvasState.scene);
    }, [sceneObjects, canvasState]);

    // const [cameraZoomObserver] = useState(new CameraZoomToGridDivisionsObserver(floorPlanState, canvasState.scene));
    //
    // useEffect(() => {
    //     registerObserver(canvasState.observers, cameraZoomObserver);
    //     return () => {
    //         deregisterObserver(canvasState.observers, cameraZoomObserver);
    //     };
    // }, [cameraZoomObserver]);
    //
    if (wallThickness === undefined) {
        return (<p>Wczytywanie...</p>);
    } else {
        return (
            <>
                <FloorPlanMainController
                    className={"app-bottom-menu"}
                    scene={canvasState.scene}
                    mainInputHandler={canvasState.mainInputHandler}
                    wallThickness={wallThickness}
                    wallHeight={sceneObjects.wallHeight}
                    placedWalls={sceneObjects.placedWalls}
                    wallComponents={sceneObjects.wallComponents}
                    floors={sceneObjects.floors}
                    doorDefinitions={doorDefinitions}
                    windowDefinitions={windowDefinitions}
                />
            </>
        );
    }
};
