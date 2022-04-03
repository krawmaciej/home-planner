import { useContext, useEffect, useState } from "react";
import WallDrawingIH from "../UI/inputHandlers/wallDrawing/WallDrawingIH";
import ControllerFactory, { FactorySubcomponentProps } from "./ControllerFactory";
import { Context } from "./FloorPlanMainController";

const WallController: React.FC<FactorySubcomponentProps> = ({ goBack }) => {

    const context = useContext(Context);

    useEffect(() => {
        if (context === undefined) {
            throw new Error("Context is undefined!");
        }
        const wallDrawer = context.wallDrawer;
        context.mainInputHandler.changeHandlingStrategy(new WallDrawingIH(wallDrawer))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log(context);
    return (
        <>
            <div>
                {
                context?.placedWalls.map(v => {
                    return (<p>{JSON.stringify(v.props.points)}</p>);
                })}
            </div>
            <button onClick={goBack}>Powrót</button>
        </>
    );
}

export default WallController;
