import React, {createContext, useRef, useState} from "react";
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
import {FloorsDrawer} from "../components/FloorsDrawer";
import {FloorCeiling} from "../objects/floor/FloorCeiling";
import {FloorsController} from "./FloorsController";
import {WallComponentAdder} from "../components/WallComponentAdder";
import {IPlacedWallComponent} from "../objects/component/IPlacedWallComponent";
import {ComponentProps} from "../objects/component/WallComponent";

type Props = {
    className?: string,
    scene: Scene,
    mainInputHandler: MainInputHandler,
    wallThickness: WallThickness, // todo: might be created in this component, cause it is only used by wall adder, see todo line 71
    wallHeight: number,
    placedWalls: Array<PlacedWall>,
    floors: Array<FloorCeiling>,
    wallComponents: Array<IPlacedWallComponent>,
    doorDefinitions: Array<ComponentProps>,
    windowDefinitions: Array<ComponentProps>,
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
    doorDefinitions: Array<ComponentProps>,
    windowDefinitions: Array<ComponentProps>,
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
                                                             doorDefinitions,
                                                             windowDefinitions,
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
    const [wallDrawer] = useState(new WallDrawer(scene, collisionDetector, placedWalls, updateWallsToggle, wallComponents, floors, wallThickness, wallHeight)); // todo: update only on wallThickness change, might move to WallController fully
    const [wallComponentAdder] = useState(new WallComponentAdder(scene, collisionDetector, placedWalls, wallComponents, 5 / 10)); // todo: same as above
    const [floorsDrawer] = useState(new FloorsDrawer(scene, collisionDetector, floors, placedWalls));

    // dependency container
    const context: FloorPlanContextType = {
        mainInputHandler,
        wallThickness,
        placedWalls,
        collisionDetector,
        wallDrawer,
        wallComponentAdder,
        floorsDrawer,
        doorDefinitions,
        windowDefinitions,
    };

    return (
        <FloorPlanContext.Provider value={context}>
            <ControllerFactory type={controllerType} providers={factoryProviders.current}/>
        </FloorPlanContext.Provider>
    );
};
