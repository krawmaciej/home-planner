import {Scene} from "three";
import {ObjectPoints} from "../constants/Types";
import {IMovingWindowComponent} from "./window/IMovingWindowComponent";

export interface ISceneObject {
    addTo(scene: Scene): void;
    removeFrom(scene: Scene): void;
    objectPoints(): ObjectPoints;
}
