import "../css/MainStyle.css"

import React, { useEffect, useState } from 'react';

import { Color, Line, Scene, Vector2, Vector3 } from 'three';
import FloorPlanCanvas from "./UI/FloorPlanCanvas";
import FloorPlanView from "./UI/FloorPlanView";
import { PointerPosition } from "./constants/Types";
import PlacedWall from "./objects/PlacedWall";
import { isConstructorDeclaration } from "typescript";
import DrawedWallBuilder from "./objects/DrawedWallBuilder";
import WallThickness from "./objects/WallThickness";
import { ENFILE } from "constants";
import { ComponentElevation, RenderOrder } from "../arranger/constants/Types";
import LiangBarsky from "./components/LiangBarsky";
import CollisionDetector from "./components/CollisionDetector";
import Drawed from "./objects/Drawed";

enum DrawState {
    DRAWING,
    SELECTING
}

const FloorPlanController: React.FC<{}> = () => {

    let drawedWall: Drawed | undefined; // after wall is drawn there is no more wall being drawn
    const walls = new Array<PlacedWall>(); // walls used to detect collisions

    const testWalls = new Array<Drawed>();

    const collisionDetector = new CollisionDetector();

    const [scene] = useState<Scene>(new Scene());
    const [wallThickness, setWallThickness] = useState<WallThickness>(new WallThickness(1.0));

    // tests
    let y = 0.0;

    useEffect(() => {
        scene.background = new Color(0x999999);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Draw wall which is being currently drawn by the user.
     * @param start pointer starting point
     * @param end pointer ending point
     */
    const moveDrawedWall = (start: Vector3, end: Vector3) => {
        start.y = ComponentElevation.WALL;
        end.y = ComponentElevation.WALL;

        const wallBuilder = DrawedWallBuilder.createWall(start, end, wallThickness);

        const collided = collisionDetector.detectDrawedCollisions(wallBuilder.props, testWalls);
        const dWall = wallBuilder.setCollided(collided).build();

        if (dWall?.wall !== undefined) {
            scene.remove(dWall.wall);
        }
        dWall.wall.renderOrder = RenderOrder.WALL;
        scene.add(dWall.wall);
        drawedWall = dWall;

        // console.log(scene.children.length);

        // wall = checkCollisions(wall); // DO NOT CHECK COLLISIONS ON MOVING DRAWED WALL
        // todo: need two walls or something to keep track if there is a wall being drawn now (it should be, cause it should)
        // walls.push(wall);
        // scene.add(wall.line);
        // if (drawState === DrawState.SELECTING) {
        //     drawState = DrawState.DRAWING;
        //     startingPoint = start;
        // } else if (drawState === DrawState.DRAWING) {
        //     drawState = DrawState.SELECTING;
        //     endingPoint = getSimpleAxisPoint(start);
        //     // draw line between starting and ending
        //     if (startingPoint === undefined) {
        //         throw new Error("Starting point not set!");
        //     }
        //     let wall = new Wall(startingPoint, endingPoint);
        //     wall = checkCollisions(wall);
        //     walls.push(wall);
        //     scene.add(wall.line);
        
    }

    const drawWall = (start: Vector3, end: Vector3) => {
        start.y = ComponentElevation.WALL;
        end.y = ComponentElevation.WALL;
        const wallBuilder = DrawedWallBuilder.createWall(start, end, wallThickness);

        const collided = collisionDetector.detectDrawedCollisions(wallBuilder.props, testWalls);

        if (collided) {
            console.log("wall collides!");
            return; // do not draw the wall
        }

        const dWall = wallBuilder.build();


        if (drawedWall?.wall !== undefined) {
            scene.remove(drawedWall.wall);
        }
        scene.add(dWall.wall);
        testWalls.push(dWall);
        drawedWall = undefined;



        
        // const x = Math.round(point.x);
        // const y = point.y;
        // const z =  Math.round(point.z);
        // point.set(x, y, z);

        

        // if (drawState === DrawState.DRAWING) { // meaning startPoint is set so it can be replaced to startPointCheck
        //     // collisionDetection.check(event);

        //     if (drawedWall !== undefined) {
        //         scene.remove(drawedWall.line);
        //     }

        //     endingPoint = getSimpleAxisPoint(point);
        //     // draw line between starting and ending
        //     if (startingPoint === undefined) {
        //         throw new Error("Starting point not set!");
        //     }
        //     let wall = new Wall(startingPoint, endingPoint);
            
        //     wall = checkCollisions(wall);
        //     // snapping colided point won't work in case of angled lines which won't be supported

        //     drawedWall = wall;
        //     scene.add(wall.line);
        // }

    }

    // change to Vector3
    const checkCollisions = (wall: PlacedWall) => {
        const mappedEndPoints = walls.map((otherWall): [PlacedWall, Vector2 | undefined] => {
            const ip = wall.intersectionPoint(otherWall);
            const belongs = doesBelongTo(ip, otherWall) && doesBelongTo(ip, wall);
            return [otherWall, belongs ? ip : undefined];
        });

        const endPoints = mappedEndPoints.filter(([otherWall, intersectionPoint]): boolean => {
            if (intersectionPoint === undefined) {
                return false;
            }
            // this might be moved somewhere else, at least I know it works
            const isSameAsNewWallStartPoint: boolean = intersectionPoint.x === wall.start.x &&
                                                       intersectionPoint.y === wall.start.z;
            const isSameAsCheckedWallEndPoint: boolean = intersectionPoint.x === otherWall.stop.x &&
                                                         intersectionPoint.y === otherWall.stop.z;
            return !(isSameAsNewWallStartPoint || isSameAsCheckedWallEndPoint);
        });

        if (endPoints.length === 0) {
            return wall;
        }

        const slicedEndPoint = endPoints.pop()?.[1];
        const startPoint = wall.start;
        const endPoint = new Vector3(slicedEndPoint?.x, wall.stop.y, slicedEndPoint?.y);

        return new PlacedWall(startPoint, endPoint);
    }

    const getSimpleAxisPoint = (start: Vector3, end: Vector3) => {
        // todo: make immutable
        if (Math.abs(end.x - start.x) > Math.abs(end.z - start.z)) {
            end.z = start.z;
        } else {
            end.x = start.x;
        }
        return end;
    }

    return (
        <div className="MainView">
            <div>
                <FloorPlanCanvas scene={scene} drawWall={drawWall} moveDrawedWall={moveDrawedWall}/>
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
