import { useContext, useEffect } from "react";
import WallComponentAddingIH from "../UI/inputHandlers/wallComponentAdding/WallComponentAddingIH";
import WallDrawingIH from "../UI/inputHandlers/wallDrawing/WallDrawingIH";
import { FactorySubcomponentProps } from "./ControllerFactory";
import { Context } from "./FloorPlanMainController";

const WallComponentController: React.FC<FactorySubcomponentProps> = ({ goBack }) => {

    const context = useContext(Context);

    const inputHandler = new WallComponentAddingIH();

    useEffect(() => {
        if (context === undefined) {
            throw new Error("Context is undefined!");
        }
        const wallDrawer = context.wallDrawer;
        context.mainInputHandler.changeHandlingStrategy(inputHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <button onClick={goBack}>Powrót</button>
            <button onClick={() => inputHandler.handleSelection(1)}>Okno1</button>
        </>
    );
}

export default WallComponentController;
