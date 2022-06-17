import React, {useContext, useEffect, useState} from "react";
import { WallDrawingIH } from "../UI/inputHandlers/wallDrawing/WallDrawingIH";
import { FactorySubcomponentProps } from "./ControllerFactory";
import { FloorPlanContext } from "./FloorPlanMainController";

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
        <>
            <div>
                {context?.placedWalls.map(v => {
                    return (<p key={v.wall.id}>{JSON.stringify(v.wall.id)}</p>);
                })}
            </div>
            <button onClick={goBack}>Powrót</button>
            <button onClick={cancelWallDrawing}>Anuluj</button>
        </>
    );
};
