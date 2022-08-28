import React, {useContext, useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {InteriorArrangerContext, SelectDefaultMenuProps} from "./InteriorArrangerMainController";
import {AddObjectController} from "./AddObjectController";
import {TransformObjectController} from "./TransformObjectController";

const DEFAULT_VARIANT = "dark";
const SELECTED_VARIANT = "light";

enum Selection {
    DEFAULT, ADD, TRANSFORM,
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
        case Selection.TRANSFORM:
            return (
                <TransformObjectController selectDefaultMenu={selectDefaultMenu}/>
            );
    }
};

const Default: React.FC<Pick<DisplayMenuProps, "changeSelection" | "upperSelectDefaultMenu">> = ({ changeSelection, upperSelectDefaultMenu }) => {
    const context = useContext(InteriorArrangerContext);
    if (context === undefined) {
        throw new Error("Context in ObjectController's Default is undefined.");
    }

    useEffect(() => {
        context.changeMenuName("Obiekty");
    }, [context.changeMenuName]);

    return (
        <>
            <Button onClick={upperSelectDefaultMenu} variant={DEFAULT_VARIANT}>
                Powrót
            </Button>
            <Button onClick={() => changeSelection(Selection.ADD)} variant={DEFAULT_VARIANT}>
                Dodaj obiekt
            </Button>
            <Button onClick={() => changeSelection(Selection.TRANSFORM)} variant={DEFAULT_VARIANT}>
                Przesuń/Obróć obiekt
            </Button>
        </>
    );
};


export const ObjectsController: React.FC<SelectDefaultMenuProps> = ({ selectDefaultMenu: upperSelectDefaultMenu }) => {
    const context = useContext(InteriorArrangerContext);
    if (context === undefined) {
        throw new Error("Context in Objects Controller is undefined.");
    }

    useEffect(() => {
        context.changeMenuName("Rzut 3D");
    }, [context.changeMenuName]);

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
