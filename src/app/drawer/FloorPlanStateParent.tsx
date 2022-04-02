import "../css/MainStyle.css"

import React, { useEffect, useState } from 'react';

import { Color, Line, Scene, Vector2, Vector3 } from 'three';
import FloorPlanCanvas from "./UI/FloorPlanCanvas";
import FloorPlanView from "./UI/FloorPlanView";
import PlacedWall from "./objects/wall/PlacedWall";
import WallBuilder from "./objects/wall/WallBuilder";
import WallThickness from "./objects/wall/WallThickness";
import { ComponentElevation, RenderOrder } from "./constants/Types";
import CollisionDetector from "./components/CollisionDetector";
import DrawedWall from "./objects/wall/DrawedWall";
import NoDrawedWall from "./objects/wall/NoDrawedWall";
import IDrawedWall from "./objects/wall/IDrawedWall";
import WallDrawer from "./components/WallDrawer";
import FloorPlanMainController from "./controllers/FloorPlanMainController";
import MainInputHandler from "./UI/inputHandlers/MainInputHandler";
import WallDrawingIH from "./UI/inputHandlers/wallDrawing/WallDrawingIH";

const FloorPlanStateParent: React.FC<{}> = () => {

    const [scene] = useState<Scene>(new Scene());
    const [wallThickness, setWallThickness] = useState<WallThickness>(new WallThickness(1.0));

    const placedWalls = new Array<PlacedWall>(); // walls used to detect collisions
    const collisionDetector = new CollisionDetector();
    const wallDrawer = new WallDrawer(scene, collisionDetector, placedWalls, wallThickness);
    const mainInputHandler = new MainInputHandler(new WallDrawingIH(wallDrawer));

    useEffect(() => {
        scene.background = new Color(0x999999);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="MainView">
            <div>
                <FloorPlanCanvas scene={scene} mainInputHandler={mainInputHandler}/>
            </div>
            <div>
                <FloorPlanMainController className={"Menu"}/>
            </div>
        </div>
    );
}

export default FloorPlanStateParent;
