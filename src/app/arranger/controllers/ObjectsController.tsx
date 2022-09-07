import React, {useContext, useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {InteriorArrangerContext, SelectDefaultMenuProps} from "./InteriorArrangerMainController";
import {AddObjectController} from "./AddObjectController";
import {TransformObjectController} from "./TransformObjectController";
import {PRIMARY_VARIANT, SECONDARY_VARIANT} from "../constants/Types";

export enum Selection {
    DEFAULT, ADD, TRANSFORM,
}

type DisplayMenuProps = {
    currentSelection: Selection,
    selectDefaultMenu: () => void,
    upperSelectDefaultMenu: () => void,
    changeSelection: (selection: Selection) => void,
    transformSelectedIndex?: number,
    addObjectToTransformObjectTransfer: (index: number) => void,
}

const DisplayMenu: React.FC<DisplayMenuProps> = ({ currentSelection, selectDefaultMenu, changeSelection, upperSelectDefaultMenu, transformSelectedIndex, addObjectToTransformObjectTransfer }) => {
    switch (currentSelection) {
        case Selection.DEFAULT:
            return (
                <Default changeSelection={changeSelection} upperSelectDefaultMenu={upperSelectDefaultMenu}/>
            );
        case Selection.ADD:
            return (
                <AddObjectController selectDefaultMenu={selectDefaultMenu} addObjectToTransformObjectTransfer={addObjectToTransformObjectTransfer}/>
            );
        case Selection.TRANSFORM:
            return (
                <TransformObjectController selectDefaultMenu={selectDefaultMenu} initialSelectedIndex={transformSelectedIndex}/>
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
            <div className="side-by-side-parent">
                <Button onClick={upperSelectDefaultMenu} variant={PRIMARY_VARIANT}
                    className="side-by-side-child btn-sm">
                    Powrót
                </Button>
            </div>
            <div className="side-by-side-parent">
                <Button onClick={() => changeSelection(Selection.ADD)} variant={SECONDARY_VARIANT}
                        className="btn-sm side-by-side-child">
                    Dodaj obiekt
                </Button>
                <Button onClick={() => changeSelection(Selection.TRANSFORM)} variant={SECONDARY_VARIANT}
                        className="btn-sm side-by-side-child">
                    Edytuj dodane obiekty
                </Button>
            </div>
        </>
    );
};


export const ObjectsController: React.FC<SelectDefaultMenuProps> = ({ selectDefaultMenu: upperSelectDefaultMenu }) => {
    const [menuSelection, setMenuSelection] = useState(Selection.DEFAULT);
    const [transformSelectedIndex, setTransformSelectedIndex] = useState<number>();

    useEffect(() => {
        if (menuSelection !== Selection.TRANSFORM) {
            setTransformSelectedIndex(undefined);
        }
    }, [menuSelection]);

    const selectDefaultMenu = () => {
        setMenuSelection(Selection.DEFAULT);
    };

    const changeSelection = (selection: Selection) => {
        setMenuSelection(selection);
    };

    const addObjectToTransformObjectTransfer = (index: number) => {
        setTransformSelectedIndex(index);
        setMenuSelection(Selection.TRANSFORM);
    };

    return (
        <DisplayMenu
            currentSelection={menuSelection}
            selectDefaultMenu={selectDefaultMenu}
            upperSelectDefaultMenu={upperSelectDefaultMenu}
            changeSelection={changeSelection}
            transformSelectedIndex={transformSelectedIndex}
            addObjectToTransformObjectTransfer={addObjectToTransformObjectTransfer}
        />
    );
};
