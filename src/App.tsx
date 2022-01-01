import "./app/css/MainStyle.css"

import React from 'react';
import './App.css';

import { Scene } from 'three';
import PlanDrawerCanvas from "./app/drawer/PlanDrawerCanvas";
import DrawerController from "./app/drawer/UI/DrawerController";

const App: React.FC<{}> = () => {

  // it might be that a single shared object will be scene (depends on how to move from drawer to planner)
  const scene = new Scene();

  return (
      <div className="MainView">
        <div>
          <PlanDrawerCanvas scene={scene}/>
        </div>
        <div>
          {/* wondering if this should be there in case of planDrawer */}
          <DrawerController className={"Menu"} scene={scene}/>
        </div>
      </div>
  );
}

export default App;
