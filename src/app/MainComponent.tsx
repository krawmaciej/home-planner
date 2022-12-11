import React, {useEffect, useRef, useState} from 'react';
import "../App.css";
import "./css/Center.css";
import "./css/HeaderMenu.css";
import "./css/SideBySide.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {InteriorArrangerStateParent} from "./arranger/InteriorArrangerStateParent";
import {HeaderMenuController} from "./common/persistance/controllers/HeaderMenuController";
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
import {loadData, saveData} from "./common/persistance/Persistance";
import spinner from "../loading-spinner.gif";

type Props = {
    renderer: WebGLRenderer,
    labelRenderer: CSS2DRenderer,
    floorPlanState: FloorPlanState,
    interiorArrangerState: InteriorArrangerState,
}

enum UISelection {
    FLOOR_PLAN, INTERIOR_ARRANGER,
}

const SAVED_PROJECT_FILE_NAME = "savedProject.json";
const RENDERED_CANVAS_FILE_NAME = "viewCapture.jpg";
const JSON_MIME = 'application/json';
const PNG_MIME = "image/jpeg";
const OCTET_STREAM_MIME = "image/octet-stream";

export const MainComponent: React.FC<Props> = ({ renderer, labelRenderer, floorPlanState, interiorArrangerState }) => {

    const getSelectionCameraHandler = (selection: UISelection): ICameraHandler => {
        switch (selection) {
            case UISelection.FLOOR_PLAN:
                return floorPlanState.cameraHandler;
            case UISelection.INTERIOR_ARRANGER:
                return interiorArrangerState.cameraHandler;
        }
    };

    const [canvasState] = useState<CanvasState>(createCanvasState);

    const [sceneObjectsState, setSceneObjectsState] = useState<SceneObjectsState>(createSceneObjectsState);
    const [doorDefinitions, setDoorDefinitions] = useState<Array<ComponentProps>>();
    const [windowDefinitions, setWindowDefinitions] = useState<Array<ComponentProps>>();
    const [objectDefinitions, setObjectDefinitions] = useState<Array<ObjectProps>>();
    const [texturePromises, setTexturePromises] = useState<Array<LoadedTexture>>();

    // load file
    const openFileRef = useRef<HTMLInputElement>(null);

    const handleStateLoad = () => {
        openFileRef?.current?.click();
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
    }, [currentMenu, sceneObjectsState]);

    const chooseInteriorArranger = () => {
        setCurrentMenu(UISelection.INTERIOR_ARRANGER);
    };

    const choosePlanDrawer = () => {
        setCurrentMenu(UISelection.FLOOR_PLAN);
    };

    const resetToPlanDrawer = () => {
        if (currentMenu === UISelection.FLOOR_PLAN) {
            chooseInteriorArranger();
        }
        choosePlanDrawer();
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

    if (
        doorDefinitions === undefined ||
        windowDefinitions === undefined ||
        objectDefinitions === undefined ||
        texturePromises === undefined
    ) {
        return (<div className="app-main-view center-div-horizontally-and-vertically"><img src={spinner} alt="loading"/></div>);
    }

    const handleLoad = () => {
        const file = openFileRef?.current?.files?.item(0);
        if (file === null || file === undefined) {
            throw new Error("Expected loaded file but nothing found");
        }

        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            const result = event?.target?.result;
            if (typeof result === 'string') {
                const loadedState = loadData(
                    result,
                    doorDefinitions,
                    windowDefinitions,
                    objectDefinitions,
                    texturePromises
                );
                setSceneObjectsState(loadedState);
                resetToPlanDrawer();
            } else {
                console.log("Couldn't load the file.");
            }
        };
        fileReader.readAsText(file);
    };

    const handleSave = () => {
        const serialized = saveData(sceneObjectsState);
        const file = new Blob([serialized], {type: JSON_MIME});
        const element = document.createElement("a");
        document.body.appendChild(element);
        element.href = URL.createObjectURL(file);
        element.download = SAVED_PROJECT_FILE_NAME;
        element.click();
        document.body.removeChild(element);
    };

    const handleSaveRender = () => {
        const cameraHandler = getSelectionCameraHandler(currentMenu);
        // re-render to avoid black image
        renderer.render(canvasState.scene, cameraHandler.getCamera());
        labelRenderer.render(canvasState.scene, cameraHandler.getCamera());

        const dataURL = renderer.domElement.toDataURL(PNG_MIME, 1.0);

        const element = document.createElement("a");
        document.body.appendChild(element);
        element.href = dataURL.replace(PNG_MIME, OCTET_STREAM_MIME);
        element.download = RENDERED_CANVAS_FILE_NAME;
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="app-main-view">
            <HeaderMenuController
                className="app-top-menu"
                openFile={handleStateLoad}
                saveFile={handleSave}
                saveRender={handleSaveRender}
                chooseInteriorArranger={chooseInteriorArranger}
                choosePlanDrawer={choosePlanDrawer}
                resetCamera={resetCamera}
            />
            <Canvas
                scene={canvasState.scene}
                renderer={renderer}
                labelRenderer={labelRenderer}
                cameraHandler={getSelectionCameraHandler(currentMenu)}
                mainInputHandler={canvasState.mainInputHandler}
                observers={canvasState.observers}
            />
            <SelectController
                selection={currentMenu}
                renderer={renderer}
                cameraHandler={getSelectionCameraHandler(currentMenu)}
                sceneObjectsState={sceneObjectsState}
                doorDefinitions={doorDefinitions}
                windowDefinitions={windowDefinitions}
                objectDefinitions={objectDefinitions}
                textures={texturePromises}
                canvasState={canvasState}
                interiorArrangerState={interiorArrangerState}
                floorPlanState={floorPlanState}
            />
            <input
                ref={openFileRef}
                className="d-none"
                type="file"
                onChange={handleLoad}
                onClick={event => (event.target as HTMLInputElement).value = ""}
            />
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
