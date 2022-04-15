import React, { useContext, useEffect, useRef, useState } from "react";
import { WindowProps } from "../objects/window/WindowComponent";
import { WallComponentAddingIH } from "../UI/inputHandlers/wallComponentAdding/WallComponentAddingIH";
import { FactorySubcomponentProps } from "./ControllerFactory";
import { Context } from "./FloorPlanMainController";

export type Observer = {
    setDistance: React.Dispatch<React.SetStateAction<number | undefined>>,
}

export const WallComponentController: React.FC<FactorySubcomponentProps> = ({ goBack }) => {
    const context = useContext(Context);
    if (context === undefined) {
        throw new Error("Context is undefined!");
    }

    const { current: windowsToSelect } = useRef<Array<WindowProps>>([{ length: 1.5, width: 1 }]);
    const [selection, setSelection] = useState<number | undefined>(undefined);
    const [componentToWindowDistance, setComponentToWindowDistance] = useState<number | undefined>(undefined);

    const { current: inputHandler } = useRef(new WallComponentAddingIH(
        context.wallComponentAdder,
        { setDistance: setComponentToWindowDistance }
    )); // todo: think about state, this shouldn't be reset if window/door is added, but should be reset if this component is fully reloaded (useRef might just work)
    context.mainInputHandler.changeHandlingStrategy(inputHandler);
    console.log("WallCompo ctrl reloaded");

    const handleSelection = (selection: number) => {
        inputHandler.handleSelection(windowsToSelect[selection]);
        setSelection(selection);
    };

    useEffect(() => {
    }, []);

    const display = () => {
        if (selection === undefined) {
            return (<button onClick={() => handleSelection(0)}>Okno1</button>);
        }

        let message = "brak wybranej ściany";
        if (componentToWindowDistance !== undefined) {
            message = componentToWindowDistance.toString();
        }

        return (
            <>
                <p>Odległość lewego dolnego rogu komponentu od lewego dolnego rogu ściany: {message}.</p>
            </>
        );
    };

    return (
        <>
            <button onClick={goBack}>Powrót</button>
            { display() }
        </>
    );
};
