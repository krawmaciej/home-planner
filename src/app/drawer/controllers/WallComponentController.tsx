import React, {useContext, useEffect, useState} from "react";
import {FactorySubcomponentProps} from "./ControllerFactory";
import {FloorPlanContext} from "./FloorPlanMainController";
import {Button} from "react-bootstrap";
import {PRIMARY_VARIANT, SECONDARY_VARIANT} from "../../arranger/constants/Types";
import {AddWallComponentController} from "./AddWallComponentController";
import {RemoveWallComponentController} from "./RemoveWallComponentController";

export enum WallComponentMenu {
    DEFAULT = "Okna i drzwi",
    ADD = "Dodaj okna i drzwi",
    DELETE = "Usuń okna i drzwi",
}

type DefaultProps = {
    changeMenu: (value: WallComponentMenu) => void,
    upperSelectDefaultMenu: () => void,
}

const Default: React.FC<DefaultProps> = ({ changeMenu, upperSelectDefaultMenu }) => {
    const context = useContext(FloorPlanContext);
    if (context === undefined) {
        throw new Error("Context in WallComponentController's Default is undefined.");
    }

    useEffect(() => {
        context.changeMenuName(WallComponentMenu.DEFAULT);
    }, [context.changeMenuName]);

    useEffect(() => {
        context.mainInputHandler.detachCurrentHandler();
    }, [context.mainInputHandler]);

    return (
        <>
            <div className="side-by-side-parent">
                <Button onClick={upperSelectDefaultMenu} variant={PRIMARY_VARIANT}
                        className="side-by-side-child btn-sm">
                    Powrót
                </Button>
            </div>
            <div className="side-by-side-parent">
                <Button onClick={() => changeMenu(WallComponentMenu.ADD)} variant={SECONDARY_VARIANT}
                        className="btn-sm side-by-side-child">
                    {WallComponentMenu.ADD}
                </Button>
                <Button onClick={() => changeMenu(WallComponentMenu.DELETE)} variant={SECONDARY_VARIANT}
                        className="btn-sm side-by-side-child">
                    {WallComponentMenu.DELETE}
                </Button>
            </div>
        </>
    );
};

type DisplayMenuProps = {
    currentSelection: WallComponentMenu,
    selectDefaultMenu: () => void,
    changeMenu: (value: WallComponentMenu) => void,
    upperSelectDefaultMenu: () => void,
}

const DisplayMenu: React.FC<DisplayMenuProps> = ({ currentSelection, selectDefaultMenu, changeMenu, upperSelectDefaultMenu }) => {
    switch (currentSelection) {
        case WallComponentMenu.DEFAULT:
            return (
                <Default changeMenu={changeMenu} upperSelectDefaultMenu={upperSelectDefaultMenu}/>
            );
        case WallComponentMenu.ADD:
            return (
                <AddWallComponentController goBack={selectDefaultMenu}/>
            );
        case WallComponentMenu.DELETE:
            return (
                <RemoveWallComponentController goBack={selectDefaultMenu}/>
            );
    }
};

export const WallComponentController: React.FC<FactorySubcomponentProps> = ({ goBack }) => {

    const [menu, setMenu] = useState<WallComponentMenu>(WallComponentMenu.DEFAULT);
    
    const selectDefaultMenu = () => {
        setMenu(WallComponentMenu.DEFAULT);
    };

    return (
        <DisplayMenu
            currentSelection={menu}
            selectDefaultMenu={selectDefaultMenu}
            changeMenu={setMenu}
            upperSelectDefaultMenu={goBack}
        />
    );
};
