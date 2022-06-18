import React, {useContext, useEffect, useState} from "react";
import { FactorySubcomponentProps } from "./ControllerFactory";
import { FloorPlanContext } from "./FloorPlanMainController";
import {FloorsDrawingIH} from "../UI/inputHandlers/floorsDrawing/FloorsDrawingIH";

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
        <>
            <button onClick={goBack}>Powrót</button>
            <button onClick={cancelFloorDrawing}>Anuluj</button>
        </>
    );
};
