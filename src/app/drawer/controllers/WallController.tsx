import React, {useContext, useEffect, useState} from "react";
import { WallDrawingIH } from "../IO/inputHandlers/wallDrawing/WallDrawingIH";
import { FactorySubcomponentProps } from "./ControllerFactory";
import {FloorPlanContext, MainControllerType} from "./FloorPlanMainController";
import {Button} from "react-bootstrap";
import {PRIMARY_VARIANT, SECONDARY_VARIANT, SELECTED_VARIANT} from "../../arranger/constants/Types";
import {VoidIH} from "../../common/canvas/inputHandler/VoidIH";
import {IInputHandler} from "../../common/canvas/inputHandler/IInputHandler";

enum Menu {
    ADD = "Dodaj ścianę",
    DELETE = "Usuń ścianę",
}

export const WallController: React.FC<FactorySubcomponentProps> = ({ goBack }) => {
    const context = useContext(FloorPlanContext);
    if (context === undefined) {
        throw new Error("Context in WallController is undefined.");
    }

    useEffect(() => {
        context.changeMenuName(MainControllerType.WALLS);
    }, [context.changeMenuName]);

    const [menu, setMenu] = useState<Menu>();
    const [inputHandler, setInputHandler] = useState<IInputHandler>(new VoidIH());

    const handleCancel = () => {
        inputHandler.handleCancel();
    };

    useEffect(() => {
        switch (menu) {
            case Menu.ADD:
                setInputHandler(new WallDrawingIH(context.wallDrawer));
                break;
            case Menu.DELETE:
                setInputHandler(new VoidIH());
                break;
            default:
                setInputHandler(new VoidIH());
        }
    }, [menu, context.wallDrawer]);

    useEffect(() => {
        context.mainInputHandler.changeHandlingStrategy(inputHandler);
    }, [inputHandler, context.mainInputHandler]);

    useEffect(() => () => {
        handleCancel();
        context.mainInputHandler.detachCurrentHandler();
    }, [inputHandler, context.mainInputHandler]);

    const cancelButton = menu !== Menu.ADD ? null :
        <Button onClick={handleCancel} variant={PRIMARY_VARIANT} className="side-by-side-child btn-sm">
            Anuluj
        </Button>;

    return (
        <>
            <div className="side-by-side-parent">
                <Button onClick={goBack} variant={PRIMARY_VARIANT} className="side-by-side-child btn-sm">
                    Powrót
                </Button>
                {cancelButton}
            </div>
            <OperationSelection currentMenu={menu} setMenu={setMenu}/>
        </>
    );
};

type OperationSelectionProps = {
    currentMenu: Menu | undefined,
    setMenu: (value: Menu) => void,
}

const OperationSelection: React.FC<OperationSelectionProps> = ({ currentMenu, setMenu }) => {

    const addVariant = currentMenu === Menu.ADD ? SELECTED_VARIANT : SECONDARY_VARIANT;
    const deleteVariant = currentMenu === Menu.DELETE ? SELECTED_VARIANT : SECONDARY_VARIANT;

    return (
        <div className="side-by-side-parent">
            <Button onClick={() => setMenu(Menu.ADD)} variant={addVariant} className="side-by-side-child btn-sm">
                {Menu.ADD}
            </Button>
            <Button onClick={() => setMenu(Menu.DELETE)} variant={deleteVariant} className="side-by-side-child btn-sm">
                {Menu.DELETE}
            </Button>
        </div>
    );
};
