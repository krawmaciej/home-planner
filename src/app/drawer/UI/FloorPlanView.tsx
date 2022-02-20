import React, { memo, useEffect, useState } from "react";
import { Scene, Vector2 } from "three";
import { Position2D } from "../../arranger/constants/Types";
import Wall from "../../arranger/objects/Wall";
import Window from "../../arranger/objects/Window";
import { PointerPosition } from "../constants/Types";

type Props = {
    className?: string
    scene: Scene
    // mousePosition: PointerPosition | undefined
}

const FloorPlanView: React.FC<Props> = ({scene}: Props) => {

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
