import "../css/MainStyle.css"

import React, { useEffect, useState } from 'react';

import { Color, Scene } from 'three';
import FloorPlanCanvas from "./UI/FloorPlanCanvas";
import FloorPlanMainController from "./controllers/FloorPlanMainController";
import MainInputHandler from "./UI/inputHandlers/MainInputHandler";
import VoidIH from "./UI/inputHandlers/VoidIH";

const FloorPlanStateParent: React.FC<{}> = () => {

    const [scene] = useState<Scene>(new Scene());

    const mainInputHandler: MainInputHandler = new MainInputHandler(new VoidIH());

    useEffect(() => {
        scene.background = new Color(0x999999);
    }, []);

    return (
        <div className="MainView">
            <div>
                <FloorPlanCanvas scene={scene} mainInputHandler={mainInputHandler}/>
            </div>
            <div>
                <FloorPlanMainController className={"Menu"} scene={scene} mainInputHandler={mainInputHandler}/>
            </div>
        </div>
    );
}

export default FloorPlanStateParent;
