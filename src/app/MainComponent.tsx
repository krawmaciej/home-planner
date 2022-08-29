import React, {useEffect, useRef, useState} from 'react';
import "../App.css";
import "./css/PersistenceMenu.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {InteriorArrangerStateParent} from "./arranger/InteriorArrangerStateParent";
import {PersistenceMenu} from "./common/persistance/PersistenceMenu";
import {createSceneObjectsState, SceneObjectsState} from "./common/context/SceneObjectsDefaults";
import {FloorPlanStateParent} from "./drawer/FloorPlanStateParent";
import {ComponentProps} from "./drawer/objects/window/WallComponent";
import {loadDoors, loadObjects, loadWindows} from "./drawer/models/WallComponentResourceLoader";
import {ObjectProps} from "./arranger/objects/ImportedObject";
import {Canvas} from "./common/canvas/Canvas";
import {CanvasState, createCanvasState} from "./common/context/CanvasDefaults";
import {createInteriorArrangerState, initializeWithInteriorArranger} from "./common/context/InteriorArrangerDefaults";
import {ACESFilmicToneMapping, NoToneMapping, WebGLRenderer} from "three";
import {OrthographicCameraHandler, PerspectiveCameraHandler} from "./common/canvas/ICameraHandler";
import {initializeWithFloorPlan} from "./common/context/FloorPlanDefaults";

type Props = {
    renderer: WebGLRenderer,
    floorPlanCameraHandler: OrthographicCameraHandler,
    interiorArrangerCameraHandler: PerspectiveCameraHandler,
}

enum UISelection {
    FLOOR_PLAN, INTERIOR_ARRANGER,
}

export const MainComponent: React.FC<Props> = ({ renderer, floorPlanCameraHandler, interiorArrangerCameraHandler }) => {

    const [canvasState] = useState<CanvasState>(createCanvasState(floorPlanCameraHandler));
    // const [floorPlanState] = useState(createFloorPlanState);
    const [interiorArrangerState] = useState(createInteriorArrangerState(interiorArrangerCameraHandler.getCamera(), renderer));
    
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
            canvasState.mainCameraHandler.changeHandler(floorPlanCameraHandler);
            canvasState.mainInputHandler.detachCurrentHandler();
            renderer.toneMapping = NoToneMapping;
            renderer.toneMappingExposure = 1;
            initializeWithFloorPlan(canvasState, floorPlanCameraHandler);

            console.log("toneMap: ", renderer.toneMapping);
            console.log("toneExpo: ", renderer.toneMappingExposure);
            console.log("outputEnc: ", renderer.outputEncoding);
            return;
        }

        if (currentMenu === UISelection.INTERIOR_ARRANGER) {
            canvasState.mainCameraHandler.changeHandler(interiorArrangerCameraHandler);
            canvasState.mainInputHandler.detachCurrentHandler();
            interiorArrangerState.transformControls.camera = interiorArrangerCameraHandler.getCamera();
            interiorArrangerState.transformControls.enabled = false;
            interiorArrangerState.orbitControls.object = interiorArrangerCameraHandler.getCamera();
            renderer.toneMapping = ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1;

            console.log("toneMap: ", renderer.toneMapping);
            console.log("toneExpo: ", renderer.toneMappingExposure);
            console.log("outputEnc: ", renderer.outputEncoding);

            initializeWithInteriorArranger(canvasState, interiorArrangerCameraHandler);

            // renderer.outputEncoding = sRGBEncoding;
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
            <PersistenceMenu
                className="app-top-menu"
                openFile={handleStateLoad}
                chooseInteriorArranger={chooseInteriorArranger}
                choosePlanDrawer={choosePlanDrawer}
            />
            <Canvas
                scene={canvasState.scene}
                renderer={renderer}
                mainCameraHandler={canvasState.mainCameraHandler}
                mainInputHandler={canvasState.mainInputHandler}
            />
            <SelectController
                selection={currentMenu}
                renderer={renderer}
                sceneObjectsState={sceneObjectsState}
                doorDefinitions={doorDefinitions}
                windowDefinitions={windowDefinitions}
                objectDefinitions={objectDefinitions}
                canvasState={canvasState}
            />
            <input ref={inputRef} className="d-none" type="file" onChange={handleFile}/>
        </div>
    );
};

type SelectionProps = {
    selection: UISelection,
    renderer: WebGLRenderer,
    sceneObjectsState: SceneObjectsState,
    doorDefinitions: Array<ComponentProps>,
    windowDefinitions: Array<ComponentProps>,
    objectDefinitions: Array<ObjectProps>,
    canvasState: CanvasState,
}

const SelectController: React.FC<SelectionProps> = ({
                                                    selection,
                                                    renderer,
                                                    sceneObjectsState,
                                                    doorDefinitions,
                                                    windowDefinitions,
                                                    objectDefinitions,
                                                    canvasState,
}: SelectionProps) => {
    if (selection === UISelection.INTERIOR_ARRANGER) {
        return (
            <>
                <InteriorArrangerStateParent
                    className="app-bottom-menu"
                    renderer={renderer}
                    canvasState={canvasState}
                    sceneObjects={sceneObjectsState}
                    objectDefinitions={objectDefinitions}
                />
            </>
        );
    } else {
        return (
            <>
                <FloorPlanStateParent
                    className="app-bottom-menu"
                    renderer={renderer}
                    canvasState={canvasState}
                    sceneObjects={sceneObjectsState}
                    doorDefinitions={doorDefinitions}
                    windowDefinitions={windowDefinitions}
                />
            </>
        );
    }
};
