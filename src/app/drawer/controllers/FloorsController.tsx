import React, {useContext, useEffect, useState} from "react";
import { FactorySubcomponentProps } from "./ControllerFactory";
import { FloorPlanContext } from "./FloorPlanMainController";
import {FloorsDrawingIH} from "../IO/inputHandlers/floorsDrawing/FloorsDrawingIH";
import {Button} from "react-bootstrap";
import {PRIMARY_VARIANT} from "../../arranger/constants/Types";

export const FloorsController: React.FC<FactorySubcomponentProps> = ({ goBack }) => {

    const context = useContext(FloorPlanContext);
    if (context === undefined) {
        throw new Error("Context in FloorsController is undefined.");
    }

    const [inputHandler, setInputHandler] = useState(new FloorsDrawingIH(context.floorsDrawer));

    const cancelFloorDrawing = () => {
        inputHandler.handleCancel();
    };

    useEffect(() => {
        context.mainInputHandler.changeHandlingStrategy(inputHandler);
    }, [inputHandler]);

    useEffect(() => {
        setInputHandler(new FloorsDrawingIH(context.floorsDrawer));
    }, [context.floorsDrawer]);

    useEffect(() => cancelFloorDrawing, [inputHandler]);

    return (
        <div className="side-by-side-parent">
            <Button onClick={goBack} variant={PRIMARY_VARIANT} className="side-by-side-child btn-sm">
                Powrót
            </Button>
            <Button onClick={cancelFloorDrawing} variant={PRIMARY_VARIANT} className="side-by-side-child btn-sm">
                Anuluj
            </Button>
        </div>
    );
};
