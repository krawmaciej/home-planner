import React, { memo, useEffect, useState } from "react";
import { Scene, Vector2 } from "three";
import { Position2D } from "../../arranger/constants/Types";
import Wall from "../../arranger/objects/Wall";
import Window from "../../arranger/objects/Window";
import { Point } from "../constants/Types";
import MousePosition from "../objects/MousePosition";

type Props = {
    className?: string
    scene: Scene
    mousePosition: Vector2 | undefined
}

const FloorPlanView: React.FC<Props> = ({scene, mousePosition}: Props) => {

    useEffect(() => {
        
    }, [scene])

    const addWall = () => {
      const wall = Wall.create({length: 50, height: 20, width: 2});
      scene.add(wall.mainWallFrame);
    }

    const addWindow = () => {
    }

    const moveRight = () => {
    }

    const moveUp = () => {
    }

    const updateUIDisplay = () => {
    }

    return (
        <>
            <button onClick={addWall}>Rysowanie ścian</button>
            <button onClick={addWindow}>Edycja ścian [przesuwanie, usuwanie, zmiana długości]</button>
            <button onClick={addWindow}>Usunięcie zaznaczonej ściany</button>
        </>
    );
}

export default FloorPlanView;
