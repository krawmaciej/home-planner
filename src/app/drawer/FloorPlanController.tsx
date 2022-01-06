import "../css/MainStyle.css"

import React, { useState } from 'react';

import { Scene, Vector2, Vector3 } from 'three';
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
    let drawState = DrawState.SELECTING;
    
    let startingPoint: Vector3 | undefined;
    let endingPoint: Vector3 | undefined;

    const lines = new Array<Wall>();


    const [mousePosition, setMousePosition] = useState<Vector2>();
    const [scene, setScene] = useState<Scene>(new Scene());

    const clickToDraw = (point: Vector3) => {
        // collisionDetection.check(event);
        
        if (drawState === DrawState.SELECTING) {
            drawState = DrawState.DRAWING;
            startingPoint = point;
            console.log("starting Point: ", startingPoint);
        } else if (drawState === DrawState.DRAWING) {
            drawState = DrawState.SELECTING;
            endingPoint = point;
            console.log("Drawing line between: ");
            console.log(startingPoint);
            console.log(endingPoint);
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
                <FloorPlanCanvas scene={scene} clickToDraw={clickToDraw} />
            </div>
            <div>
                <FloorPlanView className={"Menu"} scene={scene} mousePosition={mousePosition} />
            </div>
        </div>
    );
}

export default FloorPlanController;
