import React, {useEffect, useRef, useState} from 'react';
import "./App.css";
import "./app/css/PersistenceMenu.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {InteriorArrangerStateParent} from "./app/arranger/InteriorArrangerStateParent";
import {PersistenceMenu} from "./app/common/persistance/PersistenceMenu";
import {createSceneObjectsState, SceneObjectsState} from "./app/common/context/SceneObjectsDefaults";
import {FloorPlanStateParent} from "./app/drawer/FloorPlanStateParent";
import {ComponentProps} from "./app/drawer/objects/window/WallComponent";
import {loadDoors, loadObjects, loadWindows} from "./app/drawer/models/WallComponentResourceLoader";
import {ObjectProps} from "./app/arranger/objects/ImportedObject";
import {Canvas} from "./app/common/canvas/Canvas";
import {CanvasState, createCanvasState} from "./app/common/context/CanvasDefaults";
import { createFloorPlanState} from "./app/common/context/FloorPlanDefaults";
import {createInteriorArrangerState} from "./app/common/context/InteriorArrangerDefaults";
import {ACESFilmicToneMapping, WebGLRenderer} from "three";

type Props = {
    renderer: WebGLRenderer,
}

enum UISelection {
    FLOOR_PLAN, INTERIOR_ARRANGER,
}

export const App: React.FC<Props> = ({ renderer }) => {

    const [canvasState] = useState(createCanvasState);
    const [floorPlanState] = useState(createFloorPlanState);
    const [interiorArrangerState] = useState(createInteriorArrangerState(renderer));
    
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
            canvasState.mainCameraHandler.changeHandler(floorPlanState.camera);

            console.log("toneMap: ", renderer.toneMapping);
            console.log("toneExpo: ", renderer.toneMappingExposure);
            console.log("outputEnc: ", renderer.outputEncoding);
            return;
        }

        if (currentMenu === UISelection.INTERIOR_ARRANGER) {
            canvasState.mainCameraHandler.changeHandler(interiorArrangerState.camera);
            interiorArrangerState.transformControls.camera = interiorArrangerState.camera.getCamera();
            interiorArrangerState.orbitControls.object = interiorArrangerState.camera.getCamera();
            renderer.toneMapping = ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1;
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
