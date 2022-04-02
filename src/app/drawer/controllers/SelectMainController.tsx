import React, { useEffect, useState } from "react";
import DoorsWindowsView from "../UI/DoorsWindowsView";
import FloorPlanMainView, { MainViewProps } from "../UI/FloorPlanMainView";
import WallsView from "../UI/WallsView";
import MainControllerFactory, { MainControllerType } from "./MainControllerFactory";

type Props = {
    className?: string,
    setType: (type: MainControllerType) => void
}

 // todo: refactor so it uses controllers only instead of views as state
 // maybe this logic can be moved to parent and this one will only display its view and not control others
const SelectMainController: React.FC<Props> = ({ setType }: Props) => {

    useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const selectWalls = () => {
        setType(MainControllerType.WALLS);
    }

    const selectWindowsAndDoors = () => {
        setType(MainControllerType.WINDOWS_AND_DOORS);
    }



    // instead of ifs uses factory with strategy state
    return (
        <>
            <button onClick={selectWalls}>Ściany</button>
            <button onClick={selectWindowsAndDoors}>Okna i drzwi</button>
            <button onClick={undefined}>Reset</button>
        </>
        // <CurrentSubController walls={setWalls} doorsAndWindows={setDoors}/>
    );
}

export default SelectMainController;
