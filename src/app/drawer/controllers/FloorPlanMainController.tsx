import React, { useEffect, useRef, useState } from "react";
import DoorsWindowsView from "../UI/DoorsWindowsView";
import FloorPlanMainView, { MainViewProps } from "../UI/FloorPlanMainView";
import WallsView from "../UI/WallsView";
import WindowsDoorsController from "./WindowsDoorsController";
import ControllerFactory, { ComponentProvider } from "./ControllerFactory";
import SelectMainController from "./SelectMainController";
import WallController from "./WallController";

type Props = {
    className?: string
}

export enum MainControllerType {
    WALLS, WINDOWS_AND_DOORS, SELECT
}

 // todo: refactor so it uses controllers only instead of views as state
 // maybe this logic can be moved to parent and this one will only display its view and not control others
const FloorPlanMainController: React.FC<Props> = () => {

    const setType = (type: MainControllerType) => {
        setControllerType(type);
    }
    
    const setDefaultType = () => {
        setControllerType(MainControllerType.SELECT);
    }

    const initializeComponentProviders = () => {
        const factoryProviders = new Array<ComponentProvider>(3); // todo: cache it

        const mapProvider = (type: MainControllerType, provider: JSX.Element) => {
            factoryProviders[type] = () => provider;
        }

        mapProvider(MainControllerType.SELECT, <SelectMainController setType={setType}/>);
        mapProvider(MainControllerType.WALLS, <WallController goBack={setDefaultType}/>);
        mapProvider(MainControllerType.WINDOWS_AND_DOORS, <WindowsDoorsController goBack={setDefaultType}/>);

        return factoryProviders;
    }

    const [controllerType, setControllerType] = useState<MainControllerType>(MainControllerType.SELECT); // initial state is select
    const factoryProviders = useRef<Array<ComponentProvider>>(initializeComponentProviders());

    useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <ControllerFactory type={controllerType} providers={factoryProviders.current}/>
    );
}

export default FloorPlanMainController;
