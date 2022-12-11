import React, {useContext, useEffect, useState} from "react";
import { FactorySubcomponentProps } from "./ControllerFactory";
import {FloorPlanContext, MainControllerType} from "./FloorPlanMainController";
import {FloorsDrawingIH} from "../IO/inputHandlers/floorsDrawing/FloorsDrawingIH";
import {Button} from "react-bootstrap";
import {PRIMARY_VARIANT, SECONDARY_VARIANT, SELECTED_VARIANT} from "../../arranger/constants/Types";
import {IInputHandler} from "../../common/canvas/inputHandler/IInputHandler";
import {VoidIH} from "../../common/canvas/inputHandler/VoidIH";
import {RemoveObjectIH} from "../IO/inputHandlers/RemoveObjectIH";

enum Menu {
    ADD = "Add floor along with ceiling",
    DELETE = "Remove floor along with ceiling",
}

export const FloorsController: React.FC<FactorySubcomponentProps> = ({ goBack }) => {
    const context = useContext(FloorPlanContext);
    if (context === undefined) {
        throw new Error("Context in FloorsController is undefined.");
    }

    useEffect(() => {
        context.changeMenuName(MainControllerType.FLOORS);
    }, [context.changeMenuName]);

    const [menu, setMenu] = useState<Menu>();
    const [inputHandler, setInputHandler] = useState<IInputHandler>(new VoidIH());

    const handleCancel = () => {
        inputHandler.handleCancel();
    };

    useEffect(() => {
        switch (menu) {
            case Menu.ADD:
                setInputHandler(new FloorsDrawingIH(context.floorsDrawer));
                break;
            case Menu.DELETE:
                setInputHandler(new RemoveObjectIH(context.floorsRemover));
                break;
            default:
                setInputHandler(new VoidIH());
        }
    }, [menu, context.floorsDrawer]);

    useEffect(() => {
        context.mainInputHandler.changeHandlingStrategy(inputHandler);
    }, [inputHandler, context.mainInputHandler]);

    useEffect(() => () => {
        handleCancel();
        context.mainInputHandler.detachCurrentHandler();
    }, [inputHandler, context.mainInputHandler]);

    const cancelButton = menu !== Menu.ADD ? null :
        <Button onClick={handleCancel} variant={PRIMARY_VARIANT} className="side-by-side-child btn-sm">
            Cancel
        </Button>;

    return (
        <>
            <div className="side-by-side-parent">
                <Button onClick={goBack} variant={PRIMARY_VARIANT} className="side-by-side-child btn-sm">
                    Back
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
