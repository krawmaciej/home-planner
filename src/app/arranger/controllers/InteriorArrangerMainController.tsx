import React from "react";
import { Scene } from "three";
import {MainInputHandler} from "../../common/canvas/inputHandler/MainInputHandler";
import {ObjectProps} from "../objects/ImportedObject";

type Props = {
    className?: string
    scene: Scene,
    mainInputHandler: MainInputHandler,
    objectDefinitions: Array<ObjectProps>,
}

export const InteriorArrangerMainController: React.FC<Props> = ({scene, mainInputHandler, objectDefinitions}: Props) => {

    return (
        <>
        </>
    );
};
