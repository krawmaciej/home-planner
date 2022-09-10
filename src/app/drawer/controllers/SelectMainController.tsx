import React from "react";
import { MainFactoryComponentProps } from "./ControllerFactory";
import { MainControllerType } from "./FloorPlanMainController";
import {Button} from "react-bootstrap";
import {SECONDARY_VARIANT} from "../../arranger/constants/Types";

export const SelectMainController: React.FC<MainFactoryComponentProps<MainControllerType>> = ({ setType }) => {

    const selectWalls = () => {
        setType(MainControllerType.WALLS);
    };

    const selectWindowsAndDoors = () => {
        setType(MainControllerType.WINDOWS_AND_DOORS);
    };

    const selectFloors = () => {
        setType(MainControllerType.FLOORS);
    };

    return (
        <div className="side-by-side-parent">
            <Button onClick={selectWalls} variant={SECONDARY_VARIANT} className="side-by-side-child btn-sm">
                {MainControllerType.WALLS}
            </Button>
            <Button onClick={selectWindowsAndDoors} variant={SECONDARY_VARIANT} className="side-by-side-child btn-sm">
                {MainControllerType.WINDOWS_AND_DOORS}
            </Button>
            <Button onClick={selectFloors} variant={SECONDARY_VARIANT} className="side-by-side-child btn-sm">
                {MainControllerType.FLOORS}
            </Button>
        </div>
    );
};
