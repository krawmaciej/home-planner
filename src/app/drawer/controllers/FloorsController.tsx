import React, { useContext, useEffect } from "react";
import { FactorySubcomponentProps } from "./ControllerFactory";
import { FloorPlanContext } from "./FloorPlanMainController";
import {FloorsDrawingIH} from "../UI/inputHandlers/floorsDrawing/FloorsDrawingIH";

export const FloorsController: React.FC<FactorySubcomponentProps> = ({ goBack }) => {

    const context = useContext(FloorPlanContext);

    if (context === undefined) {
        throw new Error("Context in FloorsController is undefined.");
    }

    useEffect(() => {
        context.mainInputHandler.changeHandlingStrategy(new FloorsDrawingIH(context.floorsDrawer));
    }, [context.floorsDrawer]);

    return (
        <>
            <button onClick={goBack}>Powrót</button>
            <button onClick={goBack}>Anuluj</button>
        </>
    );
};
