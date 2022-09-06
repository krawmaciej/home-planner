import React, {createContext, useContext, useEffect, useState} from "react";

import {ObjectProps} from "../objects/ImportedObject";
import {Button} from "react-bootstrap";
import {ObjectsController} from "./ObjectsController";
import {InteriorArrangerState} from "../../../App";
import {SECONDARY_VARIANT} from "../constants/Types";
import {SceneObjectsState} from "../../common/context/SceneObjectsDefaults";
import {CanvasState} from "../../common/context/CanvasDefaults";
import { WallsAppearanceController } from "./WallsAppearanceController";
import {ConvertedObjects} from "../InteriorArrangerStateParent";
import {Texture} from "three";

type InteriorArrangerContextType = {
    canvasState: CanvasState,
    sceneObjectsState: SceneObjectsState,
    interiorArrangerState: InteriorArrangerState,
    objectDefinitions: Array<ObjectProps>,
    textures: Array<Promise<Texture>>,
    changeMenuName: (menuName: string) => void,
    updatePlacedObjectsToggle: (value: (prev: boolean) => boolean) => void,
    convertedObjects: ConvertedObjects,
}

export const InteriorArrangerContext = createContext<InteriorArrangerContextType | undefined>(undefined);

type Props = {
    className?: string
    canvasState: CanvasState,
    sceneObjectsState: SceneObjectsState,
    interiorArrangerState: InteriorArrangerState,
    objectDefinitions: Array<ObjectProps>,
    textures: Array<Promise<Texture>>,
    updatePlacedObjectsToggle: (value: (prev: boolean) => boolean) => void,
    convertedObjects: ConvertedObjects,
}

enum Selection {
    DEFAULT, OBJECTS, WALLS,
}

type DisplayMenuProps = {
    currentSelection: Selection,
    selectDefaultMenu: () => void,
    changeSelection: (selection: Selection) => void,
}

type ChangeMenuProps = Pick<DisplayMenuProps, "changeSelection">

export type SelectDefaultMenuProps = Pick<DisplayMenuProps, "selectDefaultMenu">

const DisplayMenu: React.FC<DisplayMenuProps> = ({ currentSelection, selectDefaultMenu, changeSelection }) => {
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
                <WallsAppearanceController selectDefaultMenu={selectDefaultMenu}/>
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
        <div className="side-by-side-parent">
            <Button
                onClick={() => changeSelection(Selection.OBJECTS)}
                variant={SECONDARY_VARIANT}
                className="side-by-side-child btn-sm"
            >
                Obiekty...
            </Button>
            <Button
                onClick={() => changeSelection(Selection.WALLS)}
                variant={SECONDARY_VARIANT}
                className="side-by-side-child btn-sm"
            >
                Edytuj wygląd ścian
            </Button>
        </div>
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
        convertedObjects,
    };

    return (
        <>
            {menuName}
            <InteriorArrangerContext.Provider value={context}>
                <DisplayMenu
                    currentSelection={menuSelection}
                    selectDefaultMenu={selectDefaultMenu}
                    changeSelection={changeSelection}
                />
            </InteriorArrangerContext.Provider>
        </>
    );
};

