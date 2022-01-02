import "./app/css/MainStyle.css"

import React, { useState } from 'react';
import './App.css';

import { Scene, Vector2 } from 'three';
import FloorPlanCanvas from "./app/drawer/FloorPlanCanvas";
import FloorPlanController from "./app/drawer/UI/FloorPlanController";
import { Point } from "./app/drawer/constants/Types";

const App: React.FC<{}> = () => {

  // it might be that a single shared object will be scene (depends on how to move from drawer to planner)
  const [mousePosition, setMousePosition] = useState<Vector2>();
  const [scene, setScene] = useState<Scene>(new Scene());

  return (
      <div className="MainView">
        <div>
          <FloorPlanCanvas scene={scene} setPosition={setMousePosition}/>
        </div>
        <div>
          <FloorPlanController className={"Menu"} scene={scene} mousePosition={mousePosition}/>
        </div>
      </div>
  );
}

export default App;
