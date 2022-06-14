import React, {createContext, useEffect, useRef, useState} from "react";
import { WallComponentController } from "./WallComponentController";
import { ControllerFactory, ComponentProvider } from "./ControllerFactory";
import { SelectMainController } from "./SelectMainController";
import { WallController } from "./WallController";
import { CollisionDetector } from "../components/CollisionDetector";
import { WallDrawer } from "../components/WallDrawer";
import { PlacedWall } from "../objects/wall/PlacedWall";
import { WallThickness } from "../objects/wall/WallThickness";
import { Scene } from "three";
import { MainInputHandler } from "../../common/canvas/inputHandler/MainInputHandler";
import { VoidIH } from "../../common/canvas/inputHandler/VoidIH";
import { WallComponentAdder } from "../components/WallComponentAdder";
import {IWallComponent} from "../objects/window/IWallComponent";
import {FloorsDrawer} from "../components/FloorsDrawer";
import {Floor} from "../objects/floor/Floor";
import {FloorsController} from "./FloorsController";

type Props = {
    className?: string,
    scene: Scene,
    mainInputHandler: MainInputHandler,
    wallThickness: WallThickness, // todo: might be created in this component, cause it is only used by wall adder, see todo line 71
    wallHeight: number,
    placedWalls: Array<PlacedWall>,
    floors: Array<Floor>,
    wallComponents: Array<IWallComponent>,
}

export enum MainControllerType {
    WALLS, WINDOWS_AND_DOORS, FLOORS, SELECT,
}

type FloorPlanContextType = {
    mainInputHandler: MainInputHandler,
    wallThickness: WallThickness,
    placedWalls: PlacedWall[],
    collisionDetector: CollisionDetector,
    wallDrawer: WallDrawer,
    wallComponentAdder: WallComponentAdder,
    floorsDrawer: FloorsDrawer,
}

export const FloorPlanContext = createContext<FloorPlanContextType | undefined>(undefined);

export const FloorPlanMainController: React.FC<Props> = ({
                                                             scene,
                                                             mainInputHandler,
                                                             wallThickness,
                                                             placedWalls,
                                                             wallComponents,
                                                             floors,
                                                             wallHeight,
                                                         }) => {
    const setType = (type: MainControllerType) => {
        setControllerType(type);
    };

    const setDefaultType = () => {
        mainInputHandler.changeHandlingStrategy(new VoidIH());
        setControllerType(MainControllerType.SELECT);
    };

    const initializeComponentProviders = () => {
        const factoryProviders = new Array<ComponentProvider>(4); // todo: cache it

        const mapProvider = (type: MainControllerType, provider: JSX.Element) => {
            factoryProviders[type] = () => provider;
        };

        mapProvider(MainControllerType.SELECT, <SelectMainController setType={setType}/>);
        mapProvider(MainControllerType.WALLS, <WallController goBack={setDefaultType}/>);
        mapProvider(MainControllerType.WINDOWS_AND_DOORS, <WallComponentController goBack={setDefaultType}/>);
        mapProvider(MainControllerType.FLOORS, <FloorsController goBack={setDefaultType}/>);

        return factoryProviders;
    };

    const [controllerType, setControllerType] = useState<MainControllerType>(MainControllerType.SELECT); // initial state is select
    const factoryProviders = useRef<Array<ComponentProvider>>(initializeComponentProviders());

    const [, updateWallsToggle] = useState<boolean>(false);

    const { current: collisionDetector } = useRef(new CollisionDetector());
    const wallDrawer = new WallDrawer(scene, collisionDetector, placedWalls, updateWallsToggle, wallComponents, wallThickness, wallHeight); // todo: update only on wallThickness change, might move to WallController fully
    const wallComponentAdder = new WallComponentAdder(scene, collisionDetector, placedWalls, wallComponents); // todo: same as above
    const floorsDrawer = new FloorsDrawer(scene, collisionDetector, floors);

    useEffect(() => {
        setType(MainControllerType.SELECT);
    }, []);

    // dependency container
    const context: FloorPlanContextType = {
        mainInputHandler,
        wallThickness,
        placedWalls,
        collisionDetector,
        wallDrawer,
        wallComponentAdder,
        floorsDrawer,
    };

    console.log("context should be reloaded now with different wall drawer and compo adder");

    return (
        <FloorPlanContext.Provider value={context}>
            <ControllerFactory type={controllerType} providers={factoryProviders.current}/>
        </FloorPlanContext.Provider>
    );
};
