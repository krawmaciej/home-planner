import "../css/MainStyle.css";

import React, {useEffect, useState} from 'react';

import {FloorPlanMainController} from "./controllers/FloorPlanMainController";
import {
    FloorPlanState,
    initializeFloorPlan
} from "../common/context/FloorPlanDefaults";
import {SceneObjectsState} from "../common/context/SceneObjectsDefaults";
import {ComponentProps} from "./objects/window/WallComponent";
import {disposeSceneObjects} from "../common/context/SceneOperations";
import {CanvasState} from "../common/context/CanvasDefaults";

type Props = {
    className?: string,
    sceneObjects: SceneObjectsState,
    doorDefinitions: Array<ComponentProps>,
    windowDefinitions: Array<ComponentProps>,
    canvasState: CanvasState,
}

export const FloorPlanStateParent: React.FC<Props> = ({ sceneObjects, doorDefinitions, windowDefinitions, canvasState }) => {

    const [floorPlanState, setFloorPlanState] = useState<FloorPlanState | undefined>();
    const [zoom, setZoom] = useState<number>(0.6); // todo: retrieve zoom from state or from cam handler

    const setCameraZoomHandler = (zoom: number) => {
        canvasState.mainCameraHandler.setZoom(zoom);
        setZoom(zoom);
    };

    useEffect(() => {
        return () => {
            console.log("floor plan state on dismount");
            disposeSceneObjects(canvasState.scene, canvasState.renderer);
        };
    }, []);

    useEffect(() => {
        disposeSceneObjects(canvasState.scene, canvasState.renderer);
        initializeFloorPlan(scene, floorPlanState);

        floorPlanState.cameraHandler.setZoom(zoom);
    }, [sceneObjects, canvasState]);

    if (floorPlanState === undefined) {
        return (<p>Wczytywanie...</p>);
    } else {
        return (
            <>
                <FloorPlanMainController
                    className={"app-bottom-menu"}
                    scene={canvasState.scene}
                    mainInputHandler={canvasState.mainInputHandler}
                    wallThickness={floorPlanState.wallThickness}
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
