import React, { useContext, useEffect } from "react";
import { WallDrawingIH } from "../UI/inputHandlers/wallDrawing/WallDrawingIH";
import { FactorySubcomponentProps } from "./ControllerFactory";
import { FloorPlanContext } from "./FloorPlanMainController";

export const WallController: React.FC<FactorySubcomponentProps> = ({ goBack }) => {

    const context = useContext(FloorPlanContext);

    if (context === undefined) {
        throw new Error("Context in WallController is undefined.");
    }

    useEffect(() => {
        console.log("Wall contro reloaded, but I mean this should happen not on mount but rather on context update");
        context.mainInputHandler.changeHandlingStrategy(new WallDrawingIH(context.wallDrawer));
    }, [context.wallDrawer]);

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
