import React, {createContext, useContext, useEffect, useState} from "react";

import {ObjectProps} from "../objects/ImportedObject";
import {Button} from "react-bootstrap";
import {ObjectsController} from "./ObjectsController";
import {InteriorArrangerState} from "../../../App";
import {SECONDARY_VARIANT} from "../constants/Types";
import {SceneObjectsState} from "../../common/context/SceneObjectsDefaults";
import {CanvasState} from "../../common/context/CanvasDefaults";
import { ObjectsAppearanceController } from "./ObjectsAppearanceController";
import {ConvertedObjects} from "../InteriorArrangerStateParent";
import {LoadedTexture} from "../../common/models/TextureDefinition";

type InteriorArrangerContextType = {
    canvasState: CanvasState,
    sceneObjectsState: SceneObjectsState,
    interiorArrangerState: InteriorArrangerState,
    objectDefinitions: Array<ObjectProps>,
    textures: Array<LoadedTexture>,
    changeMenuName: (menuName: string) => void,
    updatePlacedObjectsToggle: (value: (prev: boolean) => boolean) => void,
}

export const InteriorArrangerContext = createContext<InteriorArrangerContextType | undefined>(undefined);

type Props = {
    className?: string
    canvasState: CanvasState,
    sceneObjectsState: SceneObjectsState,
    interiorArrangerState: InteriorArrangerState,
    objectDefinitions: Array<ObjectProps>,
    textures: Array<LoadedTexture>,
    updatePlacedObjectsToggle: (value: (prev: boolean) => boolean) => void,
    convertedObjects: ConvertedObjects,
}

enum Selection {
    DEFAULT= "",
    OBJECTS = "Dodaj lub edytuj obiekty",
    WALLS = "Edytuj wygląd ścian",
    FRAMES = "Edytuj wygląd framug",
    FLOORS = "Edytuj wygląd podłóg",
    CEILINGS = "Edytuj wygląd sufitów",
    ALL_PLANNER_OBJECTS = "Edytuj wygląd ścian, framug, podłóg i sufitów"
}

type DisplayMenuProps = {
    currentSelection: Selection,
    selectDefaultMenu: () => void,
    changeSelection: (selection: Selection) => void,
    convertedObjects: ConvertedObjects,
}

type ChangeMenuProps = Pick<DisplayMenuProps, "changeSelection">

export type SelectDefaultMenuProps = Pick<DisplayMenuProps, "selectDefaultMenu">

const DisplayMenu: React.FC<DisplayMenuProps> = ({ currentSelection, selectDefaultMenu, changeSelection, convertedObjects }) => {
    switch (currentSelection) {
        case Selection.DEFAULT:
            return (
                <Default changeSelection={changeSelection}/>
            );
        case Selection.OBJECTS:
            return (
                <ObjectsController selectDefaultMenu={selectDefaultMenu}/>
            );
        case Selection.WALLS:
            return (
                <ObjectsAppearanceController
                    selectDefaultMenu={selectDefaultMenu}
                    texts={{ controllerName: Selection.WALLS, unselectText: "Edytuj inną ścianę" }}
                    editableObjects={convertedObjects.wallFaces}
                />
            );
        case Selection.FRAMES:
            return (
                <ObjectsAppearanceController
                    selectDefaultMenu={selectDefaultMenu}
                    texts={{ controllerName: Selection.FRAMES, unselectText: "Edytuj inną framugę" }}
                    editableObjects={convertedObjects.wallFrames}
                />
            );
        case Selection.FLOORS:
            return (
                <ObjectsAppearanceController
                    selectDefaultMenu={selectDefaultMenu}
                    texts={{ controllerName: Selection.FLOORS, unselectText: "Edytuj inną podłogę" }}
                    editableObjects={convertedObjects.floors}
                />
            );
        case Selection.CEILINGS:
            return (
                <ObjectsAppearanceController
                    selectDefaultMenu={selectDefaultMenu}
                    texts={{ controllerName: Selection.CEILINGS, unselectText: "Edytuj inny sufit" }}
                    editableObjects={convertedObjects.ceilings}
                />
            );
        case Selection.ALL_PLANNER_OBJECTS:
            return (
                <ObjectsAppearanceController
                    selectDefaultMenu={selectDefaultMenu}
                    texts={{ controllerName: Selection.ALL_PLANNER_OBJECTS, unselectText: "Edytuj inną ścianę, framugę, sufit lub podłogę" }}
                    editableObjects={[
                        ...convertedObjects.wallFaces,
                        ...convertedObjects.wallFrames,
                        ...convertedObjects.floors,
                        ...convertedObjects.ceilings,
                    ]}
                />
            );
    }
};

const Default: React.FC<ChangeMenuProps> = ({ changeSelection }) => {
    const context = useContext(InteriorArrangerContext);
    if (context === undefined) {
        throw new Error("Context in Interrior Arranger's Default is undefined.");
    }

    useEffect(() => {
        context.changeMenuName("Rzut 3D");
    }, [context.changeMenuName]);

    return (
        <>
            <div className="side-by-side-parent">
                <Button
                    onClick={() => changeSelection(Selection.OBJECTS)}
                    variant={SECONDARY_VARIANT}
                    className="side-by-side-child btn-sm"
                >
                    {Selection.OBJECTS}
                </Button>
                <Button
                    onClick={() => changeSelection(Selection.WALLS)}
                    variant={SECONDARY_VARIANT}
                    className="side-by-side-child btn-sm"
                >
                    {Selection.WALLS}
                </Button>
                <Button
                    onClick={() => changeSelection(Selection.FRAMES)}
                    variant={SECONDARY_VARIANT}
                    className="side-by-side-child btn-sm"
                >
                    {Selection.FRAMES}
                </Button>
                <Button
                    onClick={() => changeSelection(Selection.FLOORS)}
                    variant={SECONDARY_VARIANT}
                    className="side-by-side-child btn-sm"
                >
                    {Selection.FLOORS}
                </Button>
                <Button
                    onClick={() => changeSelection(Selection.CEILINGS)}
                    variant={SECONDARY_VARIANT}
                    className="side-by-side-child btn-sm"
                >
                    {Selection.CEILINGS}
                </Button>
            </div>
            <div className="side-by-side-parent">
                <Button
                    onClick={() => changeSelection(Selection.ALL_PLANNER_OBJECTS)}
                    variant={SECONDARY_VARIANT}
                    className="side-by-side-child btn-sm"
                >
                    {Selection.ALL_PLANNER_OBJECTS}
                </Button>
            </div>
        </>
    );
};

export const InteriorArrangerMainController: React.FC<Props> = ({
                                                                    canvasState,
                                                                    sceneObjectsState,
                                                                    interiorArrangerState,
                                                                    objectDefinitions,
                                                                    textures,
                                                                    updatePlacedObjectsToggle,
                                                                    convertedObjects,
}) => {
    const [menuSelection, setMenuSelection] = useState(Selection.DEFAULT);
    const [menuName, setMenuName] = useState("");

    const selectDefaultMenu = () => {
        setMenuSelection(Selection.DEFAULT);
    };

    const changeSelection = (selection: Selection) => {
        setMenuSelection(selection);
    };

    const changeMenuName = (newMenuName: string) => {
        setMenuName(newMenuName);
    };

    // dependency container
    const context: InteriorArrangerContextType = {
        canvasState,
        sceneObjectsState,
        interiorArrangerState,
        objectDefinitions,
        textures,
        changeMenuName,
        updatePlacedObjectsToggle,
    };

    return (
        <>
            {menuName}
            <InteriorArrangerContext.Provider value={context}>
                <DisplayMenu
                    currentSelection={menuSelection}
                    selectDefaultMenu={selectDefaultMenu}
                    changeSelection={changeSelection}
                    convertedObjects={convertedObjects}
                />
            </InteriorArrangerContext.Provider>
        </>
    );
};

