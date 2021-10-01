import "./app/css/MainStyle.css"

import React from 'react';
import './App.css';

import RoomPlanner from './app/RoomPlanner';
import { Scene } from 'three';
import MainController from "./app/UI/MainController";

const App: React.FC<{}> = () => {
  const scene = new Scene();

  return (
      <div className="MainView">
        <div>
          <RoomPlanner scene={scene}/>
        </div>
        <div>
          <MainController className={"Menu"} scene={scene}/>
        </div>
      </div>
  );
}

export default App;
