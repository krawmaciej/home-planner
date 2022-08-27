import React, {createContext, useContext, useState} from "react";
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
    changeMenuName: (menuName: string) => void,
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
    const context = useContext(InteriorArrangerContext);
    if (context === undefined) {
        throw new Error("Context in Default is undefined.");
    }
    context.changeMenuName("Rzut 3D");

    return (
        <Button onClick={() => changeSelection(Selection.OBJECTS)} variant={DEFAULT_VARIANT}>
            Obiekty...
        </Button>
        // more default menu buttons
    );
};

export const InteriorArrangerMainController: React.FC<Props> = ({scene, mainInputHandler, objectDefinitions, placedObjects}) => {

    const [menuSelection, setMenuSelection] = useState(Selection.DEFAULT);
    const [menuName, setMenuName] = useState("");

    const selectDefaultMenu = () => {
        setMenuSelection(Selection.DEFAULT);
    };

    const changeSelection = (selection: Selection) => {
        setMenuSelection(selection);
    };

    const changeMenuName = (menuName: string) => {
        setMenuName(menuName);
    };

    // dependency container
    const context: InteriorArrangerContextType = {
        scene,
        mainInputHandler,
        objectDefinitions,
        placedObjects,
        changeMenuName,
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

