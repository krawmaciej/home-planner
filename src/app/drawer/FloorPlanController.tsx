import "../css/MainStyle.css"

import React, { useEffect, useState } from 'react';

import { Color, Line, Scene, Vector2, Vector3 } from 'three';
import FloorPlanCanvas from "./UI/FloorPlanCanvas";
import FloorPlanView from "./UI/FloorPlanView";
import { Point } from "./constants/Types";
import Wall from "./objects/Wall";
import { isConstructorDeclaration } from "typescript";

enum DrawState {
    DRAWING,
    SELECTING
}

const FloorPlanController: React.FC<{}> = () => {

    // it might be that a single shared object will be scene (depends on how to move from drawer to planner)
    // model
    let snapStep = 1;

    let drawState = DrawState.SELECTING;
    
    let startingPoint: Vector3 | undefined;
    let endingPoint: Vector3 | undefined;

    let drawingLine: Wall;
    const walls = new Array<Wall>();

    const [mousePosition, setMousePosition] = useState<Vector2>();
    const [scene, setScene] = useState<Scene>(new Scene());

    useEffect(() => {
        scene.background = new Color(0x999999);
    }, [scene]);

    const clickToSwitchSimpleLines = (point: Vector3) => {
        const x = Math.round(point.x);
        const y = point.y;
        const z =  Math.round(point.z);
        point.set(x, y, z);
        if (drawState === DrawState.SELECTING) {
            drawState = DrawState.DRAWING;
            startingPoint = point;
        } else if (drawState === DrawState.DRAWING) {
            drawState = DrawState.SELECTING;
            endingPoint = getSimpleAxisPoint(point);
            // draw line between starting and ending
            if (startingPoint === undefined) {
                throw new Error("Starting point not set!");
            }
            let wall = new Wall(startingPoint, endingPoint);
            wall = checkCollisions(wall);
            walls.push(wall);
            scene.add(wall.line);
        }
    }

    const moveToDrawSimpleLines = (point: Vector3) => {
        const x = Math.round(point.x);
        const y = point.y;
        const z =  Math.round(point.z);
        point.set(x, y, z);
        
        if (drawState === DrawState.DRAWING) { // meaning startPoint is set so it can be replaced to startPointCheck
            // collisionDetection.check(event);

            if (drawingLine !== undefined) {
                scene.remove(drawingLine.line);
            }

            endingPoint = getSimpleAxisPoint(point);
            // draw line between starting and ending
            if (startingPoint === undefined) {
                throw new Error("Starting point not set!");
            }
            let wall = new Wall(startingPoint, endingPoint);
            
            wall = checkCollisions(wall);
            // snapping colided point won't work in case of angled lines

            drawingLine = wall;
            scene.add(wall.line);
        }

    }

    // change to Vector3
    const checkCollisions = (wall: Wall) => {
        const mappedEndPoints = walls.map((otherWall): [Wall, Vector2 | undefined] => {
            const ip = wall.intersectionPoint(otherWall);
            const belongs = doesBelongTo(ip, otherWall) && doesBelongTo(ip, wall);
            return [otherWall, belongs ? ip : undefined];
        });

        const endPoints = mappedEndPoints.filter(([otherWall, intersectionPoint]): boolean => {
            if (intersectionPoint === undefined) {
                return false;
            }
            const isSameAsNewWallStartPoint: boolean = intersectionPoint.x === wall.start.x &&
                                                intersectionPoint.y === wall.start.z;
            const isSameAsCheckedWallEndPoint: boolean = intersectionPoint.x === otherWall.stop.x &&
                                              intersectionPoint.y === otherWall.stop.z;
            console.log("ip: ", intersectionPoint);
            console.log("wall: ", wall);
            console.log(isSameAsNewWallStartPoint);
            console.log(isSameAsCheckedWallEndPoint);
            return !(isSameAsNewWallStartPoint || isSameAsCheckedWallEndPoint);
        });

        if (endPoints.length === 0) {
            return wall;
        }

        const slicedEndPoint = endPoints.pop()?.[1];
        const startPoint = wall.start;
        const endPoint = new Vector3(slicedEndPoint?.x, wall.stop.y, slicedEndPoint?.y);

        return new Wall(startPoint, endPoint);
    }

    const getSimpleAxisPoint = (point: Vector3) => {
        // return point;
        if (startingPoint === undefined) {
            throw new Error("Unexpected error while drawing a wall");
        }
        if (Math.abs(point.x - startingPoint.x) > Math.abs(point.z - startingPoint.z)) {
            point.z = startingPoint.z;
        } else {
            point.x = startingPoint.x;
        }
        return point;
    }

    return (
        <div className="MainView">
            <div>
                <FloorPlanCanvas scene={scene} clickToDraw={moveToDrawSimpleLines} clickToSwitch={clickToSwitchSimpleLines}/>
            </div>
            <div>
                <FloorPlanView className={"Menu"} scene={scene} mousePosition={mousePosition} />
            </div>
        </div>
    );
}

export default FloorPlanController;

function doesBelongTo(ip: Vector2, wall: Wall) {
    const x1 = Math.min(wall.start.x, wall.stop.x);
    const y1 = Math.min(wall.start.z, wall.stop.z);
    const x2 = Math.max(wall.start.x, wall.stop.x);
    const y2 = Math.max(wall.start.z, wall.stop.z);

    const checkResult = (ip.x >= x1 && ip.x <= x2) &&
                        (ip.y >= y1 && ip.y <= y2);

    return checkResult;
}
