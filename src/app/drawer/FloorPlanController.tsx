import "../css/MainStyle.css"

import React, { useState } from 'react';

import { Scene, Vector2 } from 'three';
import FloorPlanCanvas from "./UI/FloorPlanCanvas";
import FloorPlanView from "./UI/FloorPlanView";
import { Point } from "./constants/Types";

const FloorPlanController: React.FC<{}> = () => {

  // it might be that a single shared object will be scene (depends on how to move from drawer to planner)
  const [mousePosition, setMousePosition] = useState<Vector2>();
  const [scene, setScene] = useState<Scene>(new Scene());

  return (
      <div className="MainView">
        <div>
          <FloorPlanCanvas scene={scene} setPosition={setMousePosition}/>
        </div>
        <div>
          <FloorPlanView className={"Menu"} scene={scene} mousePosition={mousePosition}/>
        </div>
      </div>
  );
}

export default FloorPlanController;
