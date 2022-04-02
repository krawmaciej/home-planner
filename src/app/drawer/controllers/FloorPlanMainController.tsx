import React, { useEffect, useState } from "react";
import DoorsWindowsView from "../UI/DoorsWindowsView";
import FloorPlanMainView, { MainViewProps } from "../UI/FloorPlanMainView";
import WallsView from "../UI/WallsView";
import MainControllerFactory, { MainControllerType } from "./MainControllerFactory";

type Props = {
    className?: string
}

 // todo: refactor so it uses controllers only instead of views as state
 // maybe this logic can be moved to parent and this one will only display its view and not control others
const FloorPlanMainController: React.FC<Props> = () => {

    const [controllerType, setControllerType] = useState<MainControllerType>(MainControllerType.);
    // maybe some state design pattern which depending on state will return different tsx from it's render?
    // factory component which will create component according to strategy passed to it.
    // and then this strategy can be a state which will be passed to factory, and rerender o change

    useEffect(() => {
        // setCurrentSubController(FloorPlanMainView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const setWalls = () => {
        // setCurrentSubController(WallsView);
    }

    const setDoors = () => {
        // setCurrentSubController(DoorsWindowsView);
    }



    // instead of ifs uses factory with strategy state
    return (

        <>
            <button onClick={undefined}>Rysowanie ścian</button>
            <button onClick={undefined}>Edycja ścian [przesuwanie, usuwanie, zmiana długości]</button>
            <button onClick={undefined}>Usunięcie zaznaczonej ściany</button>
        </>
        // <CurrentSubController walls={setWalls} doorsAndWindows={setDoors}/>
    );
}

export default FloorPlanMainController;
