import React, { createContext, useEffect, useRef, useState } from "react";
import WindowsDoorsController from "./WindowsDoorsController";
import ControllerFactory, { ComponentProvider } from "./ControllerFactory";
import SelectMainController from "./SelectMainController";
import WallController from "./WallController";
import CollisionDetector from "../components/CollisionDetector";
import WallDrawer from "../components/WallDrawer";
import PlacedWall from "../objects/wall/PlacedWall";
import WallThickness from "../objects/wall/WallThickness";
import { Scene } from "three";
import MainInputHandler from "../UI/inputHandlers/MainInputHandler";
import VoidIH from "../UI/inputHandlers/VoidIH";

type Props = {
    className?: string,
    scene: Scene,
    mainInputHandler: MainInputHandler,
}

export enum MainControllerType {
    WALLS, WINDOWS_AND_DOORS, SELECT
}

type ContextType = {
    mainInputHandler: MainInputHandler,
    wallThickness: WallThickness,
    setWallThickness: React.Dispatch<React.SetStateAction<WallThickness>>,
    placedWalls: PlacedWall[],
    collisionDetector: CollisionDetector,
    wallDrawer: WallDrawer,
}
export const Context = createContext<ContextType | undefined>(undefined);

const FloorPlanMainController: React.FC<Props> = ({ scene, mainInputHandler }) => {

    const setType = (type: MainControllerType) => {
        setControllerType(type);
    }
    
    const setDefaultType = () => {
        mainInputHandler.changeHandlingStrategy(new VoidIH());
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

    const [wallThickness, setWallThickness] = useState<WallThickness>(new WallThickness(1.0));
    const { current: placedWalls } = useRef(new Array<PlacedWall>());
    const [updatedWallsHelper, updateWallsToggle] = useState<boolean>(false); // refactor to separate array class

    const { current: collisionDetector } = useRef(new CollisionDetector());
    const wallDrawer = new WallDrawer(scene, collisionDetector, placedWalls, updateWallsToggle, wallThickness);

    useEffect(() => {
    }, [wallThickness]);

    const context: ContextType = {
        mainInputHandler: mainInputHandler,
        wallThickness: wallThickness,
        setWallThickness: setWallThickness,
        placedWalls: placedWalls,
        collisionDetector: collisionDetector,
        wallDrawer: wallDrawer
    };

    return (
        <Context.Provider value={context}>
            <ControllerFactory type={controllerType} providers={factoryProviders.current}/>
        </Context.Provider>
    );
}

export default FloorPlanMainController;
