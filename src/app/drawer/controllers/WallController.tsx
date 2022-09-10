import React, {useContext, useEffect, useState} from "react";
import { WallDrawingIH } from "../IO/inputHandlers/wallDrawing/WallDrawingIH";
import { FactorySubcomponentProps } from "./ControllerFactory";
import {FloorPlanContext} from "./FloorPlanMainController";
import {Button} from "react-bootstrap";
import {PRIMARY_VARIANT} from "../../arranger/constants/Types";

export const WallController: React.FC<FactorySubcomponentProps> = ({ goBack }) => {

    const context = useContext(FloorPlanContext);
    if (context === undefined) {
        throw new Error("Context in WallController is undefined.");
    }

    const [inputHandler, setInputHandler] = useState(new WallDrawingIH(context.wallDrawer));

    const cancelWallDrawing = () => {
        inputHandler.handleCancel();
    };

    useEffect(() => {
        context.mainInputHandler.changeHandlingStrategy(inputHandler);
    }, [inputHandler]);

    useEffect(() => {
        setInputHandler(new WallDrawingIH(context.wallDrawer));
    }, [context.wallDrawer]);

    useEffect(() => cancelWallDrawing, [inputHandler]);

    return (
        <div className="side-by-side-parent">
            <Button onClick={goBack} variant={PRIMARY_VARIANT} className="side-by-side-child btn-sm">
                Powrót
            </Button>
            <Button onClick={cancelWallDrawing} variant={PRIMARY_VARIANT} className="side-by-side-child btn-sm">
                Anuluj
            </Button>
        </div>
    );
};
