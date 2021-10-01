import React, { useState } from "react";
import { Scene } from "three";
import { Position2D } from "../constants/Types";
import Wall from "../Wall";
import Window from "../Window";

type Props = {
    className?: string
    scene: Scene
}

const MainController: React.FC<Props> = ({scene}: Props) => {
    
    const [windowPosition, setWindowPosition] = useState<Position2D>({
        x: 10,
        y: 0
    });

    const [wall, setWall] = useState<Wall>();

    const [window, setWindow] = useState<Window>();

    const addWall = () => {
      const wall = Wall.create({length: 50, height: 20, width: 2});
      scene.add(wall.mainWallFrame);
      setWall(wall);
    }

    const addWindow = () => {
        if (wall !== undefined) {
            const window = Window.create(windowPosition, wall);
            setWindow(window);
            updateUIDisplay();
        }
    }

    const moveRight = () => {
        if (window !== undefined) {
            window.translateX(0.5);
            updateUIDisplay();
        }
    }

    const moveUp = () => {
        if (window !== undefined) {
            window.translateY(0.5);
            updateUIDisplay();
        }
    }

    const updateUIDisplay = () => {
        if (window !== undefined) {
            setWindowPosition({x: window.mainWindowFrame.position.x, y: window.mainWindowFrame.position.y});
        }
    }

    return (
        <>
            <button onClick={addWall}>Dodaj ścianę</button>
            <button onClick={addWindow}>Dodaj okno</button>
            <button onClick={moveRight}>Przesuń okno w prawo</button>
            <button onClick={moveUp}>Przesuń okno w górę</button>
            <p>Odległość od lewego boku ściany: {windowPosition.x}</p>
            <p>Odległość od podłogi: {windowPosition.y}</p>
        </>
    );
}

export default MainController;
