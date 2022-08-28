import React, {useEffect, useRef, useState} from 'react';
import "./App.css";
import "./app/css/PersistenceMenu.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {InteriorArrangerStateParent} from "./app/arranger/InteriorArrangerStateParent";
import {PersistenceMenu} from "./app/common/persistance/PersistenceMenu";
import {createSceneObjectsState, SceneObjectsState} from "./app/common/context/SceneObjectsDefaults";
import {FloorPlanStateParent} from "./app/drawer/FloorPlanStateParent";
import {Scene} from "three";
import {ComponentProps} from "./app/drawer/objects/window/WallComponent";
import {loadDoors, loadObjects, loadWindows} from "./app/drawer/models/WallComponentResourceLoader";
import {ObjectProps} from "./app/arranger/objects/ImportedObject";

enum UISelection {
    PLAN_DRAWER, INTERIOR_ARRANGER,
}

export const App: React.FC = () => {

    const [sharedScene] = useState(new Scene());

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

    const [currentMenu, setCurrentMenu] = useState<UISelection>(UISelection.PLAN_DRAWER);

    const chooseInteriorArranger = () => {
        setCurrentMenu(UISelection.INTERIOR_ARRANGER);
    };

    const choosePlanDrawer = () => {
        setCurrentMenu(UISelection.PLAN_DRAWER);
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
            <SelectCanvas
                selection={currentMenu}
                sceneObjectsState={sceneObjectsState}
                doorDefinitions={doorDefinitions}
                windowDefinitions={windowDefinitions}
                objectDefinitions={objectDefinitions}
                sharedScene={sharedScene}
            />
            <input ref={inputRef} className="d-none" type="file" onChange={handleFile}/>
        </div>
    );
};

type SelectionProps = {
    selection: UISelection,
    sceneObjectsState: SceneObjectsState,
    doorDefinitions: Array<ComponentProps>,
    windowDefinitions: Array<ComponentProps>,
    objectDefinitions: Array<ObjectProps>,
    sharedScene: Scene,
}

const SelectCanvas: React.FC<SelectionProps> = ({
                                                    selection,
                                                    sceneObjectsState,
                                                    doorDefinitions,
                                                    windowDefinitions,
                                                    sharedScene,
                                                    objectDefinitions,
}: SelectionProps) => {
    if (selection === UISelection.INTERIOR_ARRANGER) {
        return (
            <InteriorArrangerStateParent
                className="app-bottom-menu"
                scene={sharedScene}
                sceneObjects={sceneObjectsState}
                objectDefinitions={objectDefinitions}
            />
        );
    } else {
        return (
            <FloorPlanStateParent
                className="app-bottom-menu"
                scene={sharedScene}
                sceneObjects={sceneObjectsState}
                doorDefinitions={doorDefinitions}
                windowDefinitions={windowDefinitions}
            />
        );
    }
};
