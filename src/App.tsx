import "./app/css/MainStyle.css"

import React from 'react';
import './App.css';

import { Scene } from 'three';
import FloorPlanCanvas from "./app/drawer/FloorPlanCanvas";
import FloorPlanController from "./app/drawer/UI/FloorPlanController";

const App: React.FC<{}> = () => {

  // it might be that a single shared object will be scene (depends on how to move from drawer to planner)
  const scene = new Scene();

  return (
      <div className="MainView">
        <div>
          <FloorPlanCanvas scene={scene}/>
        </div>
        <div>
          <FloorPlanController className={"Menu"} scene={scene}/>
        </div>
      </div>
  );
}

export default App;
