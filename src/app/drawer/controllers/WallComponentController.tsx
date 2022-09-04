import spinner from "../../../loading-spinner.gif";

import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import {
    ComponentProps,
    DEFAULT_MUTABLE_DOOR_PROPS,
    DEFAULT_MUTABLE_WINDOW_PROPS
} from "../objects/window/WallComponent";
import { WallComponentAddingIH } from "../IO/inputHandlers/wallComponentAdding/WallComponentAddingIH";
import { FactorySubcomponentProps } from "./ControllerFactory";
import { FloorPlanContext } from "./FloorPlanMainController";
import {PRIMARY_VARIANT, SELECTED_VARIANT, SECONDARY_VARIANT} from "../../arranger/constants/Types";

export type Observer = {
    setDistance: React.Dispatch<React.SetStateAction<number | undefined>>,
}

enum ComponentSelection {
    NONE,
    WINDOWS,
    DOORS,
}

export const WallComponentController: React.FC<FactorySubcomponentProps> = ({ goBack }) => {
    const context = useContext(FloorPlanContext);
    if (context === undefined) {
        throw new Error("Context in WallComponentController is undefined.");
    }

    const [windowsToSelect, setWindowsToSelect] = useState(new Array<ComponentProps>());
    const [doorsToSelect, setDoorsToSelect] = useState(new Array<ComponentProps>());

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
        return [];
    };

    const display = () => {
        const windowButtonVariant = componentSelection === ComponentSelection.WINDOWS ? PRIMARY_VARIANT : SECONDARY_VARIANT;
        const doorButtonVariant = componentSelection === ComponentSelection.DOORS ? PRIMARY_VARIANT : SECONDARY_VARIANT;

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
            <button onClick={cancelAddingComponent}>Anuluj</button>
            { display() }
        </>
    );
};

type SelectComponentsProps = {
    components: Array<ComponentProps>,
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
    if (components.length === 0) {
        return null;
    }

    if (components.length === 1) {
        return (<div><img src={spinner} alt="loading"/></div>);
    }

    let distanceParagraph = null;
    if (componentToWindowDistance !== undefined) {
        const distance = Math.round(componentToWindowDistance * 10).toString() + "cm"; // display with precision to 1 cm.
        distanceParagraph = (<p>Odległość lewego dolnego rogu komponentu od lewego dolnego rogu ściany: {distance}.</p>);
    }

    return (
        <div>
            {components.map((component, index) => {
                    let buttonVariant = SECONDARY_VARIANT;
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
            {distanceParagraph}
        </div>
    );
};
