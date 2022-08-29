import "../css/MainStyle.css";

import React, {useEffect, useState} from 'react';

import {FloorPlanMainController} from "./controllers/FloorPlanMainController";
import {SceneObjectsState} from "../common/context/SceneObjectsDefaults";
import {ComponentProps} from "./objects/window/WallComponent";
import {disposeSceneObjects} from "../common/context/SceneOperations";
import {CanvasState} from "../common/context/CanvasDefaults";
import {WallThickness} from "./objects/wall/WallThickness";
import {WebGLRenderer} from "three";

type Props = {
    className?: string,
    renderer: WebGLRenderer,
    sceneObjects: SceneObjectsState,
    doorDefinitions: Array<ComponentProps>,
    windowDefinitions: Array<ComponentProps>,
    canvasState: CanvasState,
}

export const FloorPlanStateParent: React.FC<Props> = ({ sceneObjects, doorDefinitions, windowDefinitions, canvasState, renderer }) => {

    const [wallThickness, setWallThickness] = useState(new WallThickness(1.0));
    const [zoom, setZoom] = useState<number>(0.6); // todo: retrieve zoom from state or from cam handler

    const setCameraZoomHandler = (zoom: number) => {
        canvasState.mainCameraHandler.setZoom(zoom);
        setZoom(zoom);
    };

    useEffect(() => {
        return () => {
            console.log("floor plan state on dismount");
            disposeSceneObjects(canvasState.scene, renderer);
        };
    }, [sceneObjects, canvasState]);

    useEffect(() => {
        canvasState.mainCameraHandler.setZoom(zoom);
    }, [sceneObjects, canvasState]);

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
                    wallHeight={sceneObjects.wallsHeight}
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
