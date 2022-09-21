import {Vector3} from "three";

export interface IObjectRemover {
    removeAt(position: Vector3): void;
    selectAt(position: Vector3): void;
}
