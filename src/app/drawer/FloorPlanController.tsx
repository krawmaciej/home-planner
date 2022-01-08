import "../css/MainStyle.css"

import React, { useEffect, useState } from 'react';

import { Color, Line, Scene, Vector2, Vector3 } from 'three';
import FloorPlanCanvas from "./UI/FloorPlanCanvas";
import FloorPlanView from "./UI/FloorPlanView";
import { Point } from "./constants/Types";
import Wall from "./objects/Wall";

enum DrawState {
    DRAWING,
    SELECTING
}

const FloorPlanController: React.FC<{}> = () => {

    // it might be that a single shared object will be scene (depends on how to move from drawer to planner)
    // model
    let snapStep = 50;

    let drawState = DrawState.SELECTING;
    
    let startingPoint: Vector3 | undefined;
    let endingPoint: Vector3 | undefined;

    let drawingLine: Wall;
    const walls = new Array<Wall>();

    const [mousePosition, setMousePosition] = useState<Vector2>();
    const [scene, setScene] = useState<Scene>(new Scene());

    useEffect(() => {
        scene.background = new Color(0x999999);
    }, []);

    const clickToSwitch = (point: Vector3) => {
        const x = Math.floor(point.x / snapStep) * snapStep;
        const y = point.y;
        const z =  Math.floor(point.z / snapStep) * snapStep;
        point.set(x, y, z);
        if (drawState === DrawState.SELECTING) {
            drawState = DrawState.DRAWING;
            startingPoint = point;
        } else if (drawState === DrawState.DRAWING) {
            drawState = DrawState.SELECTING;
            endingPoint = point;
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

    const clickToDraw = (point: Vector3) => {
        const x =  Math.floor(point.x / snapStep) * snapStep;
        const y = point.y;
        const z =  Math.floor(point.z / snapStep) * snapStep;
        point.set(x, y, z);
        
        if (drawState === DrawState.DRAWING) { // meaning startPoint is set so it can be replaced to startPointCheck
            // collisionDetection.check(event);

            if (drawingLine !== undefined) {
                scene.remove(drawingLine.line);
            }

            endingPoint = point;
            // draw line between starting and ending
            if (startingPoint === undefined) {
                throw new Error("Starting point not set!");
            }
            let wall = new Wall(startingPoint, endingPoint);
            
            // wall = checkCollisions(wall);


            drawingLine = wall;
            scene.add(wall.line);
        }

    }

    // change to Vector3
    const checkCollisions = (wall: Wall) => {
        const endPoints = walls.filter((otherWall) => {
            const ip = wall.intersectionPoint(otherWall);
            console.log("IPoint: ", ip);
            const belongs = doesBelongTo(ip, wall);
            console.log("Wall this with other wall: ", wall);
            console.log("Other wall: ", otherWall);
            console.log("belongs: ", belongs);
            return belongs;
        });

        console.log(endPoints.length);
        if (endPoints.length === 0) {
            // console.log("Its empty");
            return wall;
        }

        const slicedEndPoint = endPoints.pop()?.intersectionPoint(wall);
        const startPoint = wall.start;
        const endPoint = new Vector3(slicedEndPoint?.x, wall.stop.y, slicedEndPoint?.y);

        return new Wall(startPoint, endPoint);
    }

    return (
        <div className="MainView">
            <div>
                <FloorPlanCanvas scene={scene} clickToDraw={clickToDraw} clickToSwitch={clickToSwitch}/>
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
