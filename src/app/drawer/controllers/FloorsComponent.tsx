import React, { useContext, useEffect, useRef, useState } from "react";
import { WindowProps } from "../objects/window/WindowComponent";
import { WallComponentAddingIH } from "../UI/inputHandlers/wallComponentAdding/WallComponentAddingIH";
import { FactorySubcomponentProps } from "./ControllerFactory";
import { FloorPlanContext } from "./FloorPlanMainController";
import {FloorsDrawingIH} from "../UI/inputHandlers/floorsDrawing/FloorsDrawingIH";

export type Observer = {
    setDistance: React.Dispatch<React.SetStateAction<number | undefined>>,
}

export const FloorsComponent: React.FC<FactorySubcomponentProps> = ({ goBack }) => {
    const context = useContext(FloorPlanContext);
    if (context === undefined) {
        throw new Error("Context in WallComponentController is undefined.");
    }

    let inputHandler = new FloorsDrawingIH(
        context.wallComponentAdder,
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
