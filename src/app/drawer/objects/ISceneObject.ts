import {Scene} from "three";
import {ObjectPoints} from "../constants/Types";

export interface ISceneObject {
    addTo(scene: Scene): void;
    removeFrom(scene: Scene): void;
    objectPointsOnScene(): ObjectPoints;
}
