import React, { useContext, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
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
        { length: 6, width: 1, height: 14, elevation: 0 },
    ]);
    const [selection, setSelection] = useState<number | undefined>(undefined);
    const [componentToWindowDistance, setComponentToWindowDistance] = useState<number | undefined>(undefined);
    const [inputHandler, setInputHandler] = useState(new WallComponentAddingIH(
            context.wallComponentAdder,
            {setDistance: setComponentToWindowDistance}
        )
    );

    const handleSelection = (selection: number) => {
        inputHandler.handleSelection(windowsToSelect[selection]);
        setSelection(selection);
    };

    const cancelAddingComponent = () => {
        inputHandler.handleCancel();
        setSelection(undefined);
    };

    useEffect(() => {
        context.mainInputHandler.changeHandlingStrategy(inputHandler);
    }, [inputHandler]);

    useEffect(() => {
        console.log("Component adder reloaded on context wall component adder change.");
        setInputHandler(new WallComponentAddingIH(
            context.wallComponentAdder,
            { setDistance: setComponentToWindowDistance }
        ));
    }, [context.wallComponentAdder]);

    useEffect(() => cancelAddingComponent, [inputHandler]);

    const display = () => {
        let message = "brak wybranej ściany";
        if (componentToWindowDistance !== undefined) {
            message = Math.round(componentToWindowDistance * 10).toString() + "cm"; // display with precision to 1 cm.
        }

        return (
            <>
                <div>
                    {windowsToSelect.map((option, index) => {
                        let buttonVariant = "dark";
                        if (selection === index) {
                            buttonVariant = "light";
                        }
                            return (
                                <Button
                                    key={index}
                                    onClick={() => handleSelection(index)}
                                    variant={buttonVariant}
                                    className="btn-sm small">
                                    Okno{index + 1}
                                </Button>
                            );
                    }
                    )}
                </div>
                <p>Odległość lewego dolnego rogu komponentu od lewego dolnego rogu ściany: {message}.</p>
            </>
        );
    };

    return (
        <>
            <button onClick={goBack}>Powrót</button>
            { display() }
            <button onClick={cancelAddingComponent}>Anuluj</button>
        </>
    );
};
