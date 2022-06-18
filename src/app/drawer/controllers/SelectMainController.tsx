import React, { useEffect } from "react";
import { MainFactoryComponentProps } from "./ControllerFactory";
import { MainControllerType } from "./FloorPlanMainController";

export const SelectMainController: React.FC<MainFactoryComponentProps<MainControllerType>> = ({ setType }) => {

    useEffect(() => {
    }, []);

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
        <>
            <button onClick={selectWalls}>Ściany</button>
            <button onClick={selectWindowsAndDoors}>Okna i drzwi</button>
            <button onClick={selectFloors}>Podłogi</button>
        </>
    );
};
