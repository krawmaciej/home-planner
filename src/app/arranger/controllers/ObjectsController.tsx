import React, {useState} from "react";
import {Button} from "react-bootstrap";
import {SelectDefaultMenuProps} from "./InteriorArrangerMainController";
import {AddObjectController} from "./AddObjectController";

const DEFAULT_VARIANT = "dark";
const SELECTED_VARIANT = "light";

enum Selection {
    DEFAULT, ADD, // EDIT... more menus
}

type DisplayMenuProps = {
    currentSelection: Selection,
    selectDefaultMenu: () => void,
    upperSelectDefaultMenu: () => void,
    changeSelection: (selection: Selection) => void,
}

const DisplayMenu: React.FC<DisplayMenuProps> = ({ currentSelection, selectDefaultMenu, changeSelection, upperSelectDefaultMenu }) => {
    switch (currentSelection) {
        case Selection.DEFAULT:
            return (
                <Default changeSelection={changeSelection} upperSelectDefaultMenu={upperSelectDefaultMenu}/>
            );
        case Selection.ADD:
            return (
                <AddObjectController selectDefaultMenu={selectDefaultMenu}/>
            );
    }
};

const Default: React.FC<Pick<DisplayMenuProps, "changeSelection" | "upperSelectDefaultMenu">> = ({ changeSelection, upperSelectDefaultMenu }) => {
    return (
        <>
            <Button onClick={upperSelectDefaultMenu} variant={DEFAULT_VARIANT}>
                Powrót
            </Button>
            <Button onClick={() => changeSelection(Selection.ADD)} variant={DEFAULT_VARIANT}>
                Dodaj obiekt
            </Button>
        </>
    );
};


export const ObjectsController: React.FC<SelectDefaultMenuProps> = ({ selectDefaultMenu: upperSelectDefaultMenu }) => {

    const [menuSelection, setMenuSelection] = useState(Selection.DEFAULT);

    const selectDefaultMenu = () => {
        setMenuSelection(Selection.DEFAULT);
    };

    const changeSelection = (selection: Selection) => {
        setMenuSelection(selection);
    };

    return (
        <DisplayMenu
            currentSelection={menuSelection}
            selectDefaultMenu={selectDefaultMenu}
            upperSelectDefaultMenu={upperSelectDefaultMenu}
            changeSelection={changeSelection}
        />
    );
};
