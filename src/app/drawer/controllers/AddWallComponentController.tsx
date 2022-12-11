import spinner from "../../../loading-spinner.gif";

import React, {useContext, useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {
    ComponentProps,
    DEFAULT_MUTABLE_DOOR_PROPS,
    DEFAULT_MUTABLE_WINDOW_PROPS
} from "../objects/component/WallComponent";
import {WallComponentAddingIH} from "../IO/inputHandlers/wallComponentAdding/WallComponentAddingIH";
import {FloorPlanContext} from "./FloorPlanMainController";
import {DISABLED_VARIANT, PRIMARY_VARIANT, SECONDARY_VARIANT, SELECTED_VARIANT} from "../../arranger/constants/Types";
import {WallComponentMenu} from "./WallComponentController";
import {convertFromAppUnitsToCm} from "../components/DisplayPrecision";

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

    const fixComponents = (componentProps: Array<ComponentProps>) => {
        componentProps.forEach(prop => {
            if ((prop.elevation + prop.height) > context.wallHeight) {
                prop.elevation = context.wallHeight - prop.height;
            }
        });
    };

    useEffect(() => {
        const componentProps = [DEFAULT_MUTABLE_DOOR_PROPS, ...context.doorDefinitions];
        fixComponents(componentProps);
        setDoorsToSelect(componentProps);
    }, [context.doorDefinitions]);

    useEffect(() => {
        const componentProps = [DEFAULT_MUTABLE_WINDOW_PROPS, ...context.windowDefinitions];
        fixComponents(componentProps);
        setWindowsToSelect(componentProps);
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

        let distance = "No wall selected";
        if (componentToWindowDistance !== undefined) {
            distance = convertFromAppUnitsToCm(componentToWindowDistance);
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
                                Windows
                            </Button>
                            <Button
                                onClick={() => handleComponentSelection(ComponentSelection.DOORS)}
                                variant={doorButtonVariant}
                                className="side-by-side-child btn-sm"
                            >
                                Doors
                            </Button>
                        </div>
                        <SelectComponents
                            components={components}
                            type={componentSelection}
                            componentIndex={indexSelection}
                            handleIndexSelection={handleIndexSelection}
                        />
                    </div>
                    <div className="side-by-side-child small">
                        Distance between component&apos;s bottom-left point and wall&apos;s bottom-left point: {distance}.
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            <div className="side-by-side-parent">
                <Button onClick={goBack} variant={PRIMARY_VARIANT} className="side-by-side-child btn-sm">
                    Back
                </Button>
                <Button onClick={cancelAddingComponent} variant={PRIMARY_VARIANT} className="side-by-side-child btn-sm">
                    Cancel
                </Button>
            </div>
            { display() }
        </>
    );
};

type SelectComponentsProps = {
    components: Array<ComponentProps>,
    type: ComponentSelection,
    componentIndex: number | undefined,
    handleIndexSelection: (index: number) => void,
}

const SelectComponents = ({
                              components,
                              type,
                              componentIndex,
                              handleIndexSelection,
                          }: SelectComponentsProps) => {
    if (components.length === 0) {
        return null; // it's fine in this component as it's stateless
    }

    if (components.length === 1) {
        return (<div className="center-div-horizontally-and-vertically"><img src={spinner} alt="loading"/></div>);
    }

    return (
        <div>
            {components.map((component, index) => {
                let buttonVariant = SECONDARY_VARIANT;
                const wallsTooSmall = component.elevation < 0;
                if (wallsTooSmall) {
                    buttonVariant = DISABLED_VARIANT;
                } else if (componentIndex === index) {
                    buttonVariant = SELECTED_VARIANT;
                }

                const elevationDiv = type === ComponentSelection.DOORS ? null : (
                    <div>Elevation: {convertFromAppUnitsToCm(component.elevation)}</div>
                );

                const header = wallsTooSmall ? "Walls height too small for component" : component.name;
                const onClickEvent = wallsTooSmall ? () => {} : () => handleIndexSelection(index);

                return (
                    <Button
                        key={index}
                        onClick={onClickEvent}
                        variant={buttonVariant}
                        className="btn-sm small"
                    >
                        <div className="side-by-side-parent">
                            <div className="side-by-side-child">
                                <div>{header}</div>
                                <div>Length: {convertFromAppUnitsToCm(component.width)}</div>
                                <div>Height: {convertFromAppUnitsToCm(component.height)}</div>
                                {elevationDiv}
                            </div>
                            <div className="side-by-side-child">
                                <img src={component.thumbnail} alt={component.name} height="100px"/>
                            </div>
                        </div>
                    </Button>
                );
            })}
        </div>
    );
};
