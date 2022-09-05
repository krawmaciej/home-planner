import React, {useEffect, useRef, useState} from 'react';
import "../App.css";
import "./css/HeaderMenu.css";
import "./css/SideBySide.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {InteriorArrangerStateParent} from "./arranger/InteriorArrangerStateParent";
import {HeaderMenu} from "./common/persistance/HeaderMenu";
import {createSceneObjectsState, SceneObjectsState} from "./common/context/SceneObjectsDefaults";
import {FloorPlanStateParent} from "./drawer/FloorPlanStateParent";
import {ComponentProps} from "./drawer/objects/window/WallComponent";
import {loadDoors, loadObjects, loadWindows} from "./common/models/ResourceLoaders";
import {ObjectProps} from "./arranger/objects/ImportedObject";
import {Canvas} from "./common/canvas/Canvas";
import {CanvasState, createCanvasState} from "./common/context/CanvasDefaults";
import {initializeWithInteriorArranger} from "./common/context/InteriorArrangerDefaults";
import { WebGLRenderer} from "three";
import {initializeWithFloorPlan} from "./common/context/FloorPlanDefaults";
import {FloorPlanState, InteriorArrangerState} from "../App";
import {ICameraHandler} from "./common/canvas/ICameraHandler";

type Props = {
    renderer: WebGLRenderer,
    floorPlanState: FloorPlanState,
    interiorArrangerState: InteriorArrangerState,
}

enum UISelection {
    FLOOR_PLAN, INTERIOR_ARRANGER,
}

export const MainComponent: React.FC<Props> = ({ renderer, floorPlanState, interiorArrangerState }) => {

    const getCurrentCameraHandler = (selection: UISelection): ICameraHandler => {
        switch (selection) {
            case UISelection.FLOOR_PLAN:
                return floorPlanState.cameraHandler;
            case UISelection.INTERIOR_ARRANGER:
                return interiorArrangerState.cameraHandler;
        }
    };

    const [canvasState] = useState<CanvasState>(createCanvasState);

    const [sceneObjectsState, setSceneObjectsState] = useState<SceneObjectsState>(createSceneObjectsState);
    const [doorDefinitions, setDoorDefinitions] = useState(new Array<ComponentProps>());
    const [windowDefinitions, setWindowDefinitions] = useState(new Array<ComponentProps>());
    const [objectDefinitions, setObjectDefinitions] = useState(new Array<ObjectProps>());

    // load file
    const inputRef = useRef<HTMLInputElement>(null);

    const handleStateLoad = () => {
        inputRef?.current?.click();
    };

    const handleFile = () => {
        const file = inputRef?.current?.files?.item(0);
        if (file === null || file === undefined) {
            throw new Error("Expected loaded file but nothing found");
        }

        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            console.log(event);
            setSceneObjectsState(createSceneObjectsState());
        };
        fileReader.readAsText(file);
    };

    const [currentMenu, setCurrentMenu] = useState(UISelection.FLOOR_PLAN);

    // update canvasState
    useEffect(() => {
        if (currentMenu === UISelection.FLOOR_PLAN) {
            canvasState.mainInputHandler.detachCurrentHandler();
            interiorArrangerState.orbitControls.enabled = false;
            interiorArrangerState.transformControls.enabled = false;

            initializeWithFloorPlan(canvasState);

            return;
        }

        if (currentMenu === UISelection.INTERIOR_ARRANGER) {
            canvasState.mainInputHandler.detachCurrentHandler();
            interiorArrangerState.orbitControls.enabled = true;
            interiorArrangerState.transformControls.enabled = true;

            initializeWithInteriorArranger(canvasState, interiorArrangerState);

            return;
        }
    }, [currentMenu]);

    const chooseInteriorArranger = () => {
        setCurrentMenu(UISelection.INTERIOR_ARRANGER);
    };

    const choosePlanDrawer = () => {
        setCurrentMenu(UISelection.FLOOR_PLAN);
    };

    useEffect(() => {
        loadDoors().then(doors => setDoorDefinitions(doors));
        loadWindows().then(windows => setWindowDefinitions(windows));
        loadObjects().then(objects => setObjectDefinitions(objects));
    }, []);

    return (
        <div className="app-main-view">
            <HeaderMenu
                className="app-top-menu"
                openFile={handleStateLoad}
                chooseInteriorArranger={chooseInteriorArranger}
                choosePlanDrawer={choosePlanDrawer}
            />
            <Canvas
                scene={canvasState.scene}
                renderer={renderer}
                cameraHandler={getCurrentCameraHandler(currentMenu)}
                mainInputHandler={canvasState.mainInputHandler}
                observers={canvasState.observers}
            />
            <SelectController
                selection={currentMenu}
                renderer={renderer}
                cameraHandler={getCurrentCameraHandler(currentMenu)}
                sceneObjectsState={sceneObjectsState}
                doorDefinitions={doorDefinitions}
                windowDefinitions={windowDefinitions}
                objectDefinitions={objectDefinitions}
                canvasState={canvasState}
                interiorArrangerState={interiorArrangerState}
                floorPlanState={floorPlanState}
            />
            <input ref={inputRef} className="d-none" type="file" onChange={handleFile}/>
        </div>
    );
};

type SelectionProps = {
    selection: UISelection,
    renderer: WebGLRenderer,
    cameraHandler: ICameraHandler,
    sceneObjectsState: SceneObjectsState,
    doorDefinitions: Array<ComponentProps>,
    windowDefinitions: Array<ComponentProps>,
    objectDefinitions: Array<ObjectProps>,
    canvasState: CanvasState,
    interiorArrangerState: InteriorArrangerState,
    floorPlanState: FloorPlanState,
}

const SelectController: React.FC<SelectionProps> = ({
                                                    selection,
                                                    renderer,
                                                    cameraHandler,
                                                    sceneObjectsState,
                                                    doorDefinitions,
                                                    windowDefinitions,
                                                    objectDefinitions,
                                                    canvasState,
                                                    interiorArrangerState,
}) => {
    if (selection === UISelection.INTERIOR_ARRANGER) {
        return (
            <>
                <InteriorArrangerStateParent
                    className="app-bottom-menu"
                    renderer={renderer}
                    cameraHandler={cameraHandler}
                    canvasState={canvasState}
                    sceneObjects={sceneObjectsState}
                    objectDefinitions={objectDefinitions}
                    interiorArrangerState={interiorArrangerState}
                />
            </>
        );
    } else {
        return (
            <>
                <FloorPlanStateParent
                    className="app-bottom-menu"
                    renderer={renderer}
                    cameraHandler={cameraHandler}
                    canvasState={canvasState}
                    sceneObjects={sceneObjectsState}
                    doorDefinitions={doorDefinitions}
                    windowDefinitions={windowDefinitions}
                />
            </>
        );
    }
};
