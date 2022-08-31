import "../css/MainStyle.css";

import React, {useEffect, useState} from 'react';

import {FloorPlanMainController} from "./controllers/FloorPlanMainController";
import {SceneObjectsState} from "../common/context/SceneObjectsDefaults";
import {ComponentProps} from "./objects/window/WallComponent";
import {disposeSceneObjects} from "../common/context/SceneOperations";
import {CanvasState} from "../common/context/CanvasDefaults";
import {WallThickness} from "./objects/wall/WallThickness";
import {WebGLRenderer} from "three";
import {ICameraHandler} from "../common/canvas/ICameraHandler";
import {addCurrentSceneObjects} from "./components/CurrentSceneObjects";

type Props = {
    className?: string,
    renderer: WebGLRenderer,
    sceneObjects: SceneObjectsState,
    doorDefinitions: Array<ComponentProps>,
    windowDefinitions: Array<ComponentProps>,
    canvasState: CanvasState,
    cameraHandler: ICameraHandler,
}

export const FloorPlanStateParent: React.FC<Props> = ({ sceneObjects, doorDefinitions, windowDefinitions, canvasState, renderer, cameraHandler }) => {

    const [wallThickness, setWallThickness] = useState(new WallThickness(1.0));
    const [zoom, setZoom] = useState<number>(0.6); // todo: retrieve zoom from state or from cam handler

    const setCameraZoomHandler = (zoom: number) => {
        cameraHandler.setZoom(zoom);
        setZoom(zoom);
    };

    useEffect(() => () => {
            console.log("floor plan state on dismount");
            disposeSceneObjects(canvasState.scene, renderer);
    }, [sceneObjects, canvasState]);

    useEffect(() => {
        cameraHandler.setZoom(zoom);
        addCurrentSceneObjects(sceneObjects, canvasState.scene);
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
