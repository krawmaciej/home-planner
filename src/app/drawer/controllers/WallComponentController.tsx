import React, { useContext, useEffect, useRef, useState } from "react";
import { WindowProps } from "../objects/window/WindowComponent";
import { WallComponentAddingIH } from "../UI/inputHandlers/wallComponentAdding/WallComponentAddingIH";
import { FactorySubcomponentProps } from "./ControllerFactory";
import { Context } from "./FloorPlanMainController";

export const WallComponentController: React.FC<FactorySubcomponentProps> = ({ goBack }) => {

    const context = useContext(Context);
    const { current: windowsToSelect } = useRef<Array<WindowProps>>([{ length: 1.5, width: 1 }]);
    const [selection, setSelection] = useState<number>(0);

    if (context === undefined) {
        throw new Error("Context is undefined!");
    }
    const { current: inputHandler } = useRef(new WallComponentAddingIH(context.wallComponentAdder)); // todo: think about state, this shouldn't be reset if window/door is added, but should be reset if this component is fully reloaded (useRef might just work)
    context.mainInputHandler.changeHandlingStrategy(inputHandler);
    console.log("WallCompo ctrl reloaded");

    const handleSelection = (selection: number) => {
        inputHandler.handleSelection(windowsToSelect[selection]);
        setSelection(selection);
    };

    useEffect(() => {
    }, []);

    return (
        <>
            <button onClick={goBack}>Powrót</button>
            <button onClick={() => handleSelection(0)}>Okno1</button>
        </>
    );
};
