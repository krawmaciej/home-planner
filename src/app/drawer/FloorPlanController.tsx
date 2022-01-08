import "../css/MainStyle.css"

import React, { useEffect, useState } from 'react';

import { Color, Scene, Vector2, Vector3 } from 'three';
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

    const lines = new Array<Wall>();


    const [mousePosition, setMousePosition] = useState<Vector2>();
    const [scene, setScene] = useState<Scene>(new Scene());

    useEffect(() => {
        scene.background = new Color(0x999999);
    }, []);

    const clickToSwitch = (point: Vector3) => {
        const x =  Math.floor(point.x / snapStep) * snapStep;
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
            const wall = new Wall(startingPoint, endingPoint);
            lines.push(wall);
            scene.add(wall.line);
        }
    }

    const clickToDraw = (point: Vector3) => {
        // collisionDetection.check(event);
        const x =  Math.floor(point.x / snapStep) * snapStep;
        const y = point.y;
        const z =  Math.floor(point.z / snapStep) * snapStep;
        point.set(x, y, z);
        
        if (drawState === DrawState.DRAWING) {

            if (lines.length > 0) {
                const toRemove = lines.pop()?.line;
                if (toRemove !== undefined) {
                    scene.remove(toRemove);
                }
            }


            endingPoint = point;
            // draw line between starting and ending
            if (startingPoint === undefined) {
                throw new Error("Starting point not set!");
            }
            const wall = new Wall(startingPoint, endingPoint);
            lines.push(wall);
            scene.add(wall.line);
        }

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
