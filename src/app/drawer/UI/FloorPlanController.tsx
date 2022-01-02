import React, { useState } from "react";
import { Scene } from "three";
import { Position2D } from "../../arranger/constants/Types";
import Wall from "../../arranger/objects/Wall";
import Window from "../../arranger/objects/Window";
import { Point } from "../constants/Types";
import MousePosition from "../objects/MousePosition";

type Props = {
    className?: string
    scene: Scene
}

const FloorPlanController: React.FC<Props> = ({scene}: Props) => {

    const [mousePosition, setMousePosition] = useState<MousePosition>(new MousePosition());

    const changeMousePosition = (position: Point) => {
        mousePosition.position = position;
    }

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
            <button onClick={addWall}>Rysowanie ścian</button>
            <button onClick={addWindow}>Edycja ścian [przesuwanie, usuwanie, zmiana długości]</button>
            <button onClick={addWindow}>Usunięcie zaznaczonej ściany</button>
            <p>Długość zaznaczonej ściany (tylko podczas edycji ściany, bez edycji długości): {windowPosition.x}</p>
        </>
    );
}

export default FloorPlanController;
