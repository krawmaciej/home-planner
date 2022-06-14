import "../css/MainStyle.css";

import React, {useEffect, useState} from 'react';

import {FloorPlanMainController} from "./controllers/FloorPlanMainController";
import {
    clearScene,
    createFloorPlanState,
    FloorPlanState,
    initializeFloorPlan
} from "../common/context/FloorPlanDefaults";
import {Canvas} from "../common/canvas/Canvas";
import {SceneObjectsState} from "../common/context/SceneObjectsDefaults";
import {Scene} from "three";

type Props = {
    className?: string,
    sceneObjects: SceneObjectsState,
    scene: Scene,
}

export const FloorPlanStateParent: React.FC<Props> = ({ sceneObjects, scene }: Props) => {

    const [floorPlanState, setFloorPlanState] = useState<FloorPlanState>(createFloorPlanState);
    const [zoom, setZoom] = useState<number>(0.6); // todo: retrieve zoom from state or from cam handler

    const setCameraZoomHandler = (zoom: number) => {
        floorPlanState.cameraHandler.setZoom(zoom);
        setZoom(zoom);
    };

    useEffect(() => {
        console.log("On mount");
    }, []);

    useEffect(() => {
        clearScene(scene, sceneObjects);
        initializeFloorPlan(scene, floorPlanState);
        floorPlanState.cameraHandler.setZoom(zoom);
        console.log("scene objects change.");
    }, [sceneObjects]);

    useEffect(() => {
        console.log("floor plan state change");
    }, [floorPlanState]);

    useEffect(() => {
        return () => {
            console.log("unmount");
        };
    }, []);

    return (
        <>
            <Canvas
                scene={scene}
                renderer={floorPlanState.renderer}
                cameraHandler={floorPlanState.cameraHandler}
                mainInputHandler={floorPlanState.mainInputHandler}
            />
            <FloorPlanMainController
                className={"app-bottom-menu"}
                scene={scene}
                mainInputHandler={floorPlanState.mainInputHandler}
                wallThickness={floorPlanState.wallThickness}
                wallHeight={floorPlanState.wallHeight}
                placedWalls={sceneObjects.placedWalls}
                wallComponents={sceneObjects.wallComponents}
                floors={sceneObjects.floors}
            />
        </>
    );
};
