import React, { useEffect } from "react";
import { MainFactoryComponentProps } from "./ControllerFactory";
import { MainControllerType } from "./FloorPlanMainController";

const SelectMainController: React.FC<MainFactoryComponentProps<MainControllerType>> = ({ setType }) => {

    useEffect(() => {
    }, []);

    const selectWalls = () => {
        setType(MainControllerType.WALLS);
    }

    const selectWindowsAndDoors = () => {
        setType(MainControllerType.WINDOWS_AND_DOORS);
    }

    return (
        <>
            <button onClick={selectWalls}>Ściany</button>
            <button onClick={selectWindowsAndDoors}>Okna i drzwi</button>
            <button onClick={undefined}>Reset</button>
        </>
    );
}

export default SelectMainController;
