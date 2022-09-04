import React, {createContext, useContext, useEffect, useState} from "react";

import {ObjectProps} from "../objects/ImportedObject";
import {Button} from "react-bootstrap";
import {ObjectsController} from "./ObjectsController";
import {InteriorArrangerState} from "../../../App";
import {SECONDARY_VARIANT} from "../constants/Types";
import {SceneObjectsState} from "../../common/context/SceneObjectsDefaults";
import {CanvasState} from "../../common/context/CanvasDefaults";

type InteriorArrangerContextType = {
    canvasState: CanvasState,
    sceneObjectsState: SceneObjectsState,
    interiorArrangerState: InteriorArrangerState,
    objectDefinitions: Array<ObjectProps>,
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
    updatePlacedObjectsToggle: (value: (prev: boolean) => boolean) => void,
}

enum Selection {
    DEFAULT, OBJECTS, // EDIT_CEILINGS more menus
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
            {/*more default menu buttons*/}
        </div>
    );
};

export const InteriorArrangerMainController: React.FC<Props> = ({
                                                                    canvasState,
                                                                    sceneObjectsState,
                                                                    interiorArrangerState,
                                                                    objectDefinitions,
                                                                    updatePlacedObjectsToggle,
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
                />
            </InteriorArrangerContext.Provider>
        </>
    );
};

