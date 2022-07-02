import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import {
    ComponentProps,
    DEFAULT_MUTABLE_DOOR_PROPS,
    DEFAULT_MUTABLE_WINDOW_PROPS
} from "../objects/window/WallComponent";
import { WallComponentAddingIH } from "../UI/inputHandlers/wallComponentAdding/WallComponentAddingIH";
import { FactorySubcomponentProps } from "./ControllerFactory";
import { FloorPlanContext } from "./FloorPlanMainController";

export type Observer = {
    setDistance: React.Dispatch<React.SetStateAction<number | undefined>>,
}

enum ComponentSelection {
    NONE,
    WINDOWS,
    DOORS,
}

const DEFAULT_VARIANT = "dark";
const SELECTED_VARIANT = "light";

export const WallComponentController: React.FC<FactorySubcomponentProps> = ({ goBack }) => {
    const context = useContext(FloorPlanContext);
    if (context === undefined) {
        throw new Error("Context in WallComponentController is undefined.");
    }

    const [windowsToSelect, setWindowsToSelect] = useState([DEFAULT_MUTABLE_WINDOW_PROPS]);
    const [doorsToSelect, setDoorsToSelect] = useState([DEFAULT_MUTABLE_DOOR_PROPS]);

    const [componentSelection, setComponentSelection] = useState(ComponentSelection.NONE);
    const [indexSelection, setIndexSelection] = useState<number | undefined>(undefined);

    const [componentToWindowDistance, setComponentToWindowDistance] = useState<number | undefined>(undefined);
    const [inputHandler, setInputHandler] = useState(new WallComponentAddingIH(
            context.wallComponentAdder,
            {setDistance: setComponentToWindowDistance}
        )
    );

    const handleIndexSelection = (selection: number) => {
        if (componentSelection === ComponentSelection.DOORS) {
            inputHandler.handleDoorSelection(doorsToSelect[selection]);
            setIndexSelection(selection);
        } else if (componentSelection === ComponentSelection.WINDOWS) {
            inputHandler.handleWindowSelection(windowsToSelect[selection]);
            setIndexSelection(selection);
        }
    };

    const handleComponentSelection = (selection: ComponentSelection) => {
        setComponentSelection(selection);
        cancelAddingComponent();
    };

    const cancelAddingComponent = () => {
        inputHandler.handleCancel();
        setIndexSelection(undefined);
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

    useEffect(() => {
        setDoorsToSelect([DEFAULT_MUTABLE_DOOR_PROPS, ...context.doorDefinitions]);
    }, [context.doorDefinitions]);

    useEffect(() => {
        setWindowsToSelect([DEFAULT_MUTABLE_WINDOW_PROPS, ...context.windowDefinitions]);
    }, [context.windowDefinitions]);

    useEffect(() => cancelAddingComponent, [inputHandler]);

    const getComponentsToDisplay = (selection: ComponentSelection) => {
        if (selection === ComponentSelection.WINDOWS) {
            return windowsToSelect;
        }
        if (selection === ComponentSelection.DOORS) {
            return doorsToSelect;
        }
        return null;
    };

    const display = () => {
        const windowButtonVariant = componentSelection === ComponentSelection.WINDOWS ? SELECTED_VARIANT : DEFAULT_VARIANT;
        const doorButtonVariant = componentSelection === ComponentSelection.DOORS ? SELECTED_VARIANT : DEFAULT_VARIANT;

        const components = getComponentsToDisplay(componentSelection);

        return (
            <div>
                <Button onClick={() => handleComponentSelection(ComponentSelection.WINDOWS)} variant={windowButtonVariant}>
                    Okna
                </Button>
                <Button onClick={() => handleComponentSelection(ComponentSelection.DOORS)} variant={doorButtonVariant}>
                    Drzwi
                </Button>
                <SelectComponents
                    components={components}
                    componentIndex={indexSelection}
                    handleIndexSelection={handleIndexSelection}
                    componentToWindowDistance={componentToWindowDistance}
                />
            </div>
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

type SelectComponentsProps = {
    components: Array<ComponentProps> | null,
    componentIndex: number | undefined,
    handleIndexSelection: (index: number) => void,
    componentToWindowDistance: number | undefined,
}

const SelectComponents = ({
                              components,
                              componentIndex,
                              handleIndexSelection,
                              componentToWindowDistance
                          }: SelectComponentsProps) => {
    if (!components) {
        return null;
    }

    let message = "Brak wybranej ściany";
    if (componentToWindowDistance !== undefined) {
        message = Math.round(componentToWindowDistance * 10).toString() + "cm"; // display with precision to 1 cm.
    }

    return (
        <div>
            {components.map((component, index) => {
                    let buttonVariant = DEFAULT_VARIANT;
                    if (componentIndex === index) {
                        buttonVariant = SELECTED_VARIANT;
                    }
                    return (
                        <Button
                            key={index}
                            onClick={() => handleIndexSelection(index)}
                            variant={buttonVariant}
                            className="btn-sm small"
                        >
                            {component.name}
                        </Button>
                    );
                }
            )}
            <p>Odległość lewego dolnego rogu komponentu od lewego dolnego rogu ściany: {message}.</p> :
        </div>
    );
};
