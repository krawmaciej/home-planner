import { Vector3 } from "three";
import { IPlacedWindowComponent } from "./IPlacedWindowComponent";
import { IWallComponent } from "./IWallComponent";
import {PlacedWall} from "../wall/PlacedWall";

export interface IMovingWindowComponent extends IWallComponent {
    createPlacedComponent(position: Vector3): IPlacedWindowComponent;
    unsetParentWall(wall: PlacedWall): void;
}
