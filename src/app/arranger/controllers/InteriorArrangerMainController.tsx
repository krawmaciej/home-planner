import React, {createContext, useState} from "react";
import {Object3D, Scene} from "three";
import {MainInputHandler} from "../../common/canvas/inputHandler/MainInputHandler";
import {ObjectProps} from "../objects/ImportedObject";
import {Button} from "react-bootstrap";
import {ObjectsController} from "./ObjectsController";

const DEFAULT_VARIANT = "dark";
const SELECTED_VARIANT = "light";

type InteriorArrangerContextType = {
    scene: Scene,
    mainInputHandler: MainInputHandler,
    objectDefinitions: Array<ObjectProps>,
    placedObjects: Array<Object3D>,
}

export const InteriorArrangerContext = createContext<InteriorArrangerContextType | undefined>(undefined);

type Props = {
    className?: string
    scene: Scene,
    mainInputHandler: MainInputHandler,
    objectDefinitions: Array<ObjectProps>,
    placedObjects: Array<Object3D>,
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
    return (
        <Button onClick={() => changeSelection(Selection.OBJECTS)} variant={DEFAULT_VARIANT}>
            Obiekty...
        </Button>
        // more default menu buttons
    );
};

export const InteriorArrangerMainController: React.FC<Props> = ({scene, mainInputHandler, objectDefinitions, placedObjects}) => {

    const [menuSelection, setMenuSelection] = useState(Selection.DEFAULT);

    const selectDefaultMenu = () => {
        setMenuSelection(Selection.DEFAULT);
    };

    const changeSelection = (selection: Selection) => {
        setMenuSelection(selection);
    };

    // dependency container
    const context: InteriorArrangerContextType = {
        scene,
        mainInputHandler,
        objectDefinitions,
        placedObjects,
    };

    return (
        <InteriorArrangerContext.Provider value={context}>
            <DisplayMenu
                currentSelection={menuSelection}
                selectDefaultMenu={selectDefaultMenu}
                changeSelection={changeSelection}
            />
        </InteriorArrangerContext.Provider>
    );
};

