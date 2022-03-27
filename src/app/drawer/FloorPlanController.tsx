import "../css/MainStyle.css"

import React, { useEffect, useState } from 'react';

import { Color, Line, Scene, Vector2, Vector3 } from 'three';
import FloorPlanCanvas from "./UI/FloorPlanCanvas";
import FloorPlanView from "./UI/FloorPlanView";
import PlacedWall from "./objects/wall/PlacedWall";
import DrawedWallBuilder from "./objects/wall/DrawedWallBuilder";
import WallThickness from "./objects/wall/WallThickness";
import { ComponentElevation, RenderOrder } from "./constants/Types";
import CollisionDetector from "./components/CollisionDetector";
import DrawedWall from "./objects/wall/DrawedWall";
import NoDrawedWall from "./objects/wall/NoDrawedWall";
import IDrawedWall from "./objects/wall/IDrawedWall";
import WallDrawer from "./components/WallDrawer";

const FloorPlanController: React.FC<{}> = () => {


    const [scene] = useState<Scene>(new Scene());
    const [wallThickness, setWallThickness] = useState<WallThickness>(new WallThickness(1.0));

    const walls = new Array<PlacedWall>(); // walls used to detect collisions
    const testWalls = new Array<DrawedWall>();
    const collisionDetector = new CollisionDetector();
    const wallDrawer = new WallDrawer(scene, collisionDetector, testWalls, wallThickness);


    useEffect(() => {
        scene.background = new Color(0x999999);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className="MainView">
            <div>
                <FloorPlanCanvas scene={scene} drawWall={wallDrawer.drawWall} moveDrawedWall={wallDrawer.moveDrawedWall}/>
            </div>
            <div>
                <FloorPlanView className={"Menu"} scene={scene} />
            </div>
        </div>
    );
}

export default FloorPlanController;

function doesBelongTo(ip: Vector2, wall: PlacedWall) {
    const x1 = Math.min(wall.start.x, wall.stop.x);
    const y1 = Math.min(wall.start.z, wall.stop.z);
    const x2 = Math.max(wall.start.x, wall.stop.x);
    const y2 = Math.max(wall.start.z, wall.stop.z);

    const checkResult = (ip.x >= x1 && ip.x <= x2) &&
                        (ip.y >= y1 && ip.y <= y2);

    return checkResult;
}
