import React, { useContext, useEffect } from "react";
import { WallDrawingIH } from "../UI/inputHandlers/wallDrawing/WallDrawingIH";
import { FactorySubcomponentProps } from "./ControllerFactory";
import { Context } from "./FloorPlanMainController";

export const WallController: React.FC<FactorySubcomponentProps> = ({ goBack }) => {

    const context = useContext(Context);

    useEffect(() => {
        if (context === undefined) {
            throw new Error("Context is undefined!");
        }
        const wallDrawer = context.wallDrawer;
        context.mainInputHandler.changeHandlingStrategy(new WallDrawingIH(wallDrawer));
    }, []);

    return (
        <>
            <div>
                {context?.placedWalls.map(v => {
                    return (<p key={v.wall.id}>{JSON.stringify(v.props.points)}</p>);
                })}
            </div>
            <button onClick={goBack}>Powrót</button>
        </>
    );
};
