import { Scene, Vector3 } from "three";
import IPlacedWindowComponent from "./IPlacedWindowComponent";
import IWallComponent from "./IWallComponent";

export default interface IMovingWindowComponent extends IWallComponent {
    createPlacedComponent(position: Vector3): IPlacedWindowComponent;
}
