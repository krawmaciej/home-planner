import React, {createContext, useRef, useState} from "react";
import { ControllerFactory, ComponentProvider } from "./ControllerFactory";
import { SelectMainController } from "./SelectMainController";
import { WallController } from "./WallController";
import { CollisionDetector } from "../components/CollisionDetector";
import { WallDrawer } from "../components/wall/WallDrawer";
import { PlacedWall } from "../objects/wall/PlacedWall";
import { WallThickness } from "../objects/wall/WallThickness";
import { Scene } from "three";
import { MainInputHandler } from "../../common/canvas/inputHandler/MainInputHandler";
import { VoidIH } from "../../common/canvas/inputHandler/VoidIH";
import {FloorsDrawer} from "../components/floor/FloorsDrawer";
import {FloorCeiling} from "../objects/floor/FloorCeiling";
import {FloorsController} from "./FloorsController";
import {WallComponentAdder} from "../components/component/WallComponentAdder";
import {IPlacedWallComponent} from "../objects/component/IPlacedWallComponent";
import {ComponentProps} from "../objects/component/WallComponent";
import {WallComponentController} from "./WallComponentController";
import {FloorsRemover} from "../components/floor/FloorsRemover";
import {WALL_COMPONENT_SNAP_STEP} from "../constants/Types";
import {WallComponentRemover} from "../components/component/WallComponentRemover";
import {WallRemover} from "../components/wall/WallRemover";

type Props = {
    className?: string,
    scene: Scene,
    mainInputHandler: MainInputHandler,
    wallThickness: WallThickness,
    wallHeight: number,
    placedWalls: Array<PlacedWall>,
    floors: Array<FloorCeiling>,
    wallComponents: Array<IPlacedWallComponent>,
    doorDefinitions: Array<ComponentProps>,
    windowDefinitions: Array<ComponentProps>,
}

export enum MainControllerType {
    WALLS = "Ściany",
    WINDOWS_AND_DOORS = "Okna i drzwi",
    FLOORS = "Podłogi i sufity",
    SELECT = "Rysunek planu 2D",
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
    changeMenuName: (value: string) => void,
    wallRemover: WallRemover,
    wallComponentRemover: WallComponentRemover,
    floorsRemover: FloorsRemover,
    wallHeight: number,
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
        const factoryProviders = new Map<MainControllerType, ComponentProvider>();

        const mapProvider = (type: MainControllerType, provider: JSX.Element) => {
            factoryProviders.set(type, () => provider);
        };

        mapProvider(MainControllerType.SELECT, <SelectMainController setType={setType}/>);
        mapProvider(MainControllerType.WALLS, <WallController goBack={setDefaultType}/>);
        mapProvider(MainControllerType.WINDOWS_AND_DOORS, <WallComponentController goBack={setDefaultType}/>);
        mapProvider(MainControllerType.FLOORS, <FloorsController goBack={setDefaultType}/>);

        return factoryProviders;
    };

    const [controllerType, setControllerType] = useState<MainControllerType>(MainControllerType.SELECT);
    const factoryProviders = useRef(initializeComponentProviders());

    const [, updateWallsToggle] = useState<boolean>(false);

    const { current: collisionDetector } = useRef(new CollisionDetector());
    const [wallDrawer] = useState(new WallDrawer(scene, collisionDetector, placedWalls, updateWallsToggle, wallComponents, floors, wallThickness, wallHeight));
    const [wallComponentAdder] = useState(new WallComponentAdder(scene, collisionDetector, placedWalls, wallComponents, WALL_COMPONENT_SNAP_STEP));
    const [floorsDrawer] = useState(new FloorsDrawer(scene, collisionDetector, floors, placedWalls));

    const [wallRemover] = useState(new WallRemover(scene, collisionDetector, placedWalls, wallComponents));
    const [wallComponentRemover] = useState(new WallComponentRemover(scene, collisionDetector, wallComponents));
    const [floorsRemover] = useState(new FloorsRemover(scene, collisionDetector, floors));

    // dynamic menu name holder
    const [currentControllerName, setControllerName] = useState("");

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
        changeMenuName: setControllerName,
        wallRemover,
        wallComponentRemover,
        floorsRemover,
        wallHeight,
    };

    const controllerNameDiv = currentControllerName === "" ? null : <div className="center-div-horizontally">{currentControllerName}</div>;

    return (
        <>
            {controllerNameDiv}
            <FloorPlanContext.Provider value={context}>
                <ControllerFactory type={controllerType} providers={factoryProviders.current}/>
            </FloorPlanContext.Provider>
        </>
    );
};
