import React, { createContext, useEffect, useRef, useState } from "react";
import { WallComponentController } from "./WallComponentController";
import { ControllerFactory, ComponentProvider } from "./ControllerFactory";
import { SelectMainController } from "./SelectMainController";
import { WallController } from "./WallController";
import { CollisionDetector } from "../components/CollisionDetector";
import { WallDrawer } from "../components/WallDrawer";
import { PlacedWall } from "../objects/wall/PlacedWall";
import { WallThickness } from "../objects/wall/WallThickness";
import { Scene } from "three";
import { MainInputHandler } from "../UI/inputHandlers/MainInputHandler";
import { VoidIH } from "../UI/inputHandlers/VoidIH";
import { WallComponentAdder } from "../components/WallComponentAdder";
import { IWallComponent } from "../objects/window/IWallComponent";

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
    wallComponentAdder: WallComponentAdder,
}
export const Context = createContext<ContextType | undefined>(undefined);

export const FloorPlanMainController: React.FC<Props> = ({ scene, mainInputHandler }) => {

    const setType = (type: MainControllerType) => {
        setControllerType(type);
    };
    
    const setDefaultType = () => {
        mainInputHandler.changeHandlingStrategy(new VoidIH());
        setControllerType(MainControllerType.SELECT);
    };

    const initializeComponentProviders = () => {
        const factoryProviders = new Array<ComponentProvider>(3); // todo: cache it

        const mapProvider = (type: MainControllerType, provider: JSX.Element) => {
            factoryProviders[type] = () => provider;
        };

        mapProvider(MainControllerType.SELECT, <SelectMainController setType={setType}/>);
        mapProvider(MainControllerType.WALLS, <WallController goBack={setDefaultType}/>);
        mapProvider(MainControllerType.WINDOWS_AND_DOORS, <WallComponentController goBack={setDefaultType}/>);

        return factoryProviders;
    };

    const [controllerType, setControllerType] = useState<MainControllerType>(MainControllerType.SELECT); // initial state is select
    const factoryProviders = useRef<Array<ComponentProvider>>(initializeComponentProviders());

    // walls
    const [wallThickness, setWallThickness] = useState<WallThickness>(new WallThickness(1.0));
    const { current: placedWalls } = useRef(new Array<PlacedWall>());
    const [, updateWallsToggle] = useState<boolean>(false); // refactor to separate array class

    // wall components (doors, windows)
    const { current: wallComponents } = useRef(new Array<IWallComponent>());

    const { current: collisionDetector } = useRef(new CollisionDetector());
    const wallDrawer = new WallDrawer(scene, collisionDetector, placedWalls, updateWallsToggle, wallThickness); // todo: update only on wallThickness change, might move to WallController fully
    const wallComponentAdder = new WallComponentAdder(scene, collisionDetector, placedWalls, wallComponents); // todo: same as above

    useEffect(() => {
    }, [wallThickness]);

    // dependency container
    const context: ContextType = {
        mainInputHandler,
        wallThickness,
        setWallThickness,
        placedWalls,
        collisionDetector,
        wallDrawer,
        wallComponentAdder,
    };

    return (
        <Context.Provider value={context}>
            <ControllerFactory type={controllerType} providers={factoryProviders.current}/>
        </Context.Provider>
    );
};
