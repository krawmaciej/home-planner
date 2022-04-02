import React, { useEffect } from "react";
import { MainFactoryComponentProps } from "./ControllerFactory";
import { MainControllerType } from "./FloorPlanMainController";

 // todo: refactor so it uses controllers only instead of views as state
 // maybe this logic can be moved to parent and this one will only display its view and not control others
const SelectMainController: React.FC<MainFactoryComponentProps<MainControllerType>> = ({ setType }) => {

    useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
