import {IFloor} from "./IFloor";
import {Scene, Vector3} from "three";
import {ObjectPoints} from "../../constants/Types";

export class Floor implements IFloor {

    public addTo(scene: Scene): void {
    }

    public getObjectPointsOnScene(): ObjectPoints {
        return [new Vector3(), new Vector3(), new Vector3(), new Vector3()];
    }

    public removeFrom(scene: Scene): void {
    }

}
