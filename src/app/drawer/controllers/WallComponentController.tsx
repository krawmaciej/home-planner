import React, { useContext, useEffect, useRef, useState } from "react";
import { WindowProps } from "../objects/window/WindowComponent";
import { WallComponentAddingIH } from "../UI/inputHandlers/wallComponentAdding/WallComponentAddingIH";
import { FactorySubcomponentProps } from "./ControllerFactory";
import { FloorPlanContext } from "./FloorPlanMainController";

export type Observer = {
    setDistance: React.Dispatch<React.SetStateAction<number | undefined>>,
}

export const WallComponentController: React.FC<FactorySubcomponentProps> = ({ goBack }) => {
    const context = useContext(FloorPlanContext);
    if (context === undefined) {
        throw new Error("Context in WallComponentController is undefined.");
    }

    const { current: windowsToSelect } = useRef<Array<WindowProps>>([
        { length: 8, width: 1, height: 10, elevation: 4 },
        { length: 12, width: 1, height: 5.5, elevation: 8 },
    ]);
    const [selection, setSelection] = useState<number | undefined>(undefined);
    const [componentToWindowDistance, setComponentToWindowDistance] = useState<number | undefined>(undefined);

    let inputHandler = new WallComponentAddingIH(
        context.wallComponentAdder,
        { setDistance: setComponentToWindowDistance }
    );

    const handleSelection = (selection: number) => {
        inputHandler.handleSelection(windowsToSelect[selection]);
        setSelection(selection);
    };

    useEffect(() => {
        console.log("Component adder reloaded on context.");
        inputHandler = new WallComponentAddingIH(
            context.wallComponentAdder,
            { setDistance: setComponentToWindowDistance }
        );
        context.mainInputHandler.changeHandlingStrategy(inputHandler);
    }, [context.wallComponentAdder]);

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
