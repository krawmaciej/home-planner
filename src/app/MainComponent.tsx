import React, {useEffect, useRef, useState} from 'react';
import "../App.css";
import "./css/HeaderMenu.css";
import "./css/SideBySide.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {InteriorArrangerStateParent} from "./arranger/InteriorArrangerStateParent";
import {HeaderMenu} from "./common/persistance/HeaderMenu";
import {createSceneObjectsState, SceneObjectsState} from "./common/context/SceneObjectsDefaults";
import {FloorPlanStateParent} from "./drawer/FloorPlanStateParent";
import {ComponentProps} from "./drawer/objects/component/WallComponent";
import {loadDoors, loadObjects, loadTextures, loadWindows} from "./common/models/ResourceLoaders";
import {ObjectProps} from "./arranger/objects/ImportedObject";
import {Canvas} from "./common/canvas/Canvas";
import {CanvasState, createCanvasState} from "./common/context/CanvasDefaults";
import {initializeWithInteriorArranger} from "./common/context/InteriorArrangerDefaults";
import {WebGLRenderer} from "three";
import {initializeWithFloorPlan} from "./common/context/FloorPlanDefaults";
import {FloorPlanState, InteriorArrangerState} from "../App";
import {ICameraHandler} from "./common/canvas/ICameraHandler";
import {LoadedTexture} from "./common/models/TextureDefinition";
import {CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";
import {loadData, saveFile} from "./common/persistance/Persistance";

type Props = {
    renderer: WebGLRenderer,
    labelRenderer: CSS2DRenderer,
    floorPlanState: FloorPlanState,
    interiorArrangerState: InteriorArrangerState,
}

enum UISelection {
    FLOOR_PLAN, INTERIOR_ARRANGER,
}

export const MainComponent: React.FC<Props> = ({ renderer, labelRenderer, floorPlanState, interiorArrangerState }) => {

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
    const [texturePromises, setTexturePromises] = useState(new Array<LoadedTexture>());

    // load file
    const openFileRef = useRef<HTMLInputElement>(null);

    const handleStateLoad = () => {
        openFileRef?.current?.click();
    };

    const handleFile = () => {
        const file = openFileRef?.current?.files?.item(0);
        if (file === null || file === undefined) {
            throw new Error("Expected loaded file but nothing found");
        }

        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            const result = event?.target?.result;
            if (typeof result === 'string') {
                const loadedState = loadData(result);
                setSceneObjectsState(loadedState);
            } else {
                console.log("Couldn't load a file.");
            }
        };
        fileReader.readAsText(file);
    };

    const handleSave = () => {
        const serialized = saveFile(sceneObjectsState);
        const element = document.createElement("a");
        const file = new Blob([serialized], {type: 'text/plain'});
        document.body.appendChild(element);
        element.href = URL.createObjectURL(file);
        element.download = "savedProject";
        element.click();
        document.body.removeChild(element);
    };

    const [currentMenu, setCurrentMenu] = useState(UISelection.FLOOR_PLAN);

    // update canvasState
    useEffect(() => {
        if (currentMenu === UISelection.FLOOR_PLAN) {
            canvasState.mainInputHandler.detachCurrentHandler();
            floorPlanState.orbitControls.enabled = true;
            interiorArrangerState.orbitControls.enabled = false;
            interiorArrangerState.transformControls.enabled = false;

            initializeWithFloorPlan(canvasState, floorPlanState);

            return;
        }

        if (currentMenu === UISelection.INTERIOR_ARRANGER) {
            canvasState.mainInputHandler.detachCurrentHandler();
            floorPlanState.orbitControls.enabled = false;
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

    const resetCamera = () => {
        floorPlanState.orbitControls.reset();
        interiorArrangerState.orbitControls.reset();
    };

    useEffect(() => {
        loadDoors().then(doors => setDoorDefinitions(doors));
        loadWindows().then(windows => setWindowDefinitions(windows));
        loadObjects().then(objects => setObjectDefinitions(objects));
        loadTextures().then(txts => setTexturePromises(txts));
    }, []);

    return (
        <div className="app-main-view">
            <HeaderMenu
                className="app-top-menu"
                openFile={handleStateLoad}
                saveFile={handleSave}
                chooseInteriorArranger={chooseInteriorArranger}
                choosePlanDrawer={choosePlanDrawer}
                resetCamera={resetCamera}
            />
            <Canvas
                scene={canvasState.scene}
                renderer={renderer}
                labelRenderer={labelRenderer}
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
                textures={texturePromises}
                canvasState={canvasState}
                interiorArrangerState={interiorArrangerState}
                floorPlanState={floorPlanState}
            />
            <input ref={openFileRef} className="d-none" type="file" onChange={handleFile}/>
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
    textures: Array<LoadedTexture>,
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
                                                    textures,
                                                    canvasState,
                                                    interiorArrangerState,
                                                    floorPlanState,
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
                    textures={textures}
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
                    floorPlanState={floorPlanState}
                />
            </>
        );
    }
};
