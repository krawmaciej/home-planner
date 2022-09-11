import spinner from "../../../loading-spinner.gif";

import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import {
    ComponentProps,
    DEFAULT_MUTABLE_DOOR_PROPS,
    DEFAULT_MUTABLE_WINDOW_PROPS
} from "../objects/component/WallComponent";
import { WallComponentAddingIH } from "../IO/inputHandlers/wallComponentAdding/WallComponentAddingIH";
import {FloorPlanContext} from "./FloorPlanMainController";
import {PRIMARY_VARIANT, SELECTED_VARIANT, SECONDARY_VARIANT} from "../../arranger/constants/Types";
import {WallComponentMenu} from "./WallComponentController";

export type Observer = {
    setDistance: React.Dispatch<React.SetStateAction<number | undefined>>,
}

enum ComponentSelection {
    NONE,
    WINDOWS,
    DOORS,
}

type AddWallComponentProps = {
    goBack: () => void,
}

export const AddWallComponentController: React.FC<AddWallComponentProps> = ({ goBack }) => {
    const context = useContext(FloorPlanContext);
    if (context === undefined) {
        throw new Error("Context in AddWallComponentController is undefined.");
    }

    useEffect(() => {
        context.changeMenuName(WallComponentMenu.ADD);
    }, [context.changeMenuName]);

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
        setInputHandler(new WallComponentAddingIH(
            context.wallComponentAdder,
            { setDistance: setComponentToWindowDistance }
        ));
    }, [componentSelection, context.wallComponentAdder]);

    useEffect(() => () => {
        cancelAddingComponent();
        context.mainInputHandler.detachCurrentHandler();
    }, [componentSelection, context.mainInputHandler]);

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
        const windowButtonVariant = componentSelection === ComponentSelection.WINDOWS ? SELECTED_VARIANT : SECONDARY_VARIANT;
        const doorButtonVariant = componentSelection === ComponentSelection.DOORS ? SELECTED_VARIANT : SECONDARY_VARIANT;

        const components = getComponentsToDisplay(componentSelection);

        let distance = "Brak wybranej ściany";
        if (componentToWindowDistance !== undefined) {
            distance = Math.round(componentToWindowDistance * 10).toString() + "cm"; // display with precision to 1 cm.
        }

        return (
            <>
                <div className="side-by-side-parent">
                    <div className="side-by-side-child">
                        <div className="side-by-side-parent">
                            <Button
                                onClick={() => handleComponentSelection(ComponentSelection.WINDOWS)}
                                variant={windowButtonVariant}
                                className="side-by-side-child btn-sm"
                            >
                                Okna
                            </Button>
                            <Button
                                onClick={() => handleComponentSelection(ComponentSelection.DOORS)}
                                variant={doorButtonVariant}
                                className="side-by-side-child btn-sm"
                            >
                                Drzwi
                            </Button>
                        </div>
                        <SelectComponents
                            components={components}
                            componentIndex={indexSelection}
                            handleIndexSelection={handleIndexSelection}
                        />
                    </div>
                    <div className="side-by-side-child small">
                        Odległość lewego dolnego rogu komponentu od lewego dolnego rogu ściany: {distance}.
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            <div className="side-by-side-parent">
                <Button onClick={goBack} variant={PRIMARY_VARIANT} className="side-by-side-child btn-sm">
                    Powrót
                </Button>
                <Button onClick={cancelAddingComponent} variant={PRIMARY_VARIANT} className="side-by-side-child btn-sm">
                    Anuluj
                </Button>
            </div>
            { display() }
        </>
    );
};

type SelectComponentsProps = {
    components: Array<ComponentProps>,
    componentIndex: number | undefined,
    handleIndexSelection: (index: number) => void,
}

const SelectComponents = ({
                              components,
                              componentIndex,
                              handleIndexSelection,
                          }: SelectComponentsProps) => {
    if (components.length === 0) {
        return null; // it's fine in this component as it's stateless
    }

    if (components.length === 1) {
        return (<div><img src={spinner} alt="loading"/></div>);
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
        </div>
    );
};