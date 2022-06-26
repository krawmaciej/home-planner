import { IWallComponent } from "./IWallComponent";
import {Object3D, Vector3} from "three";

/**
 * Placed wall component exists only if it has a placed parent wall.
 * However not all components that have parent walls are placed components.
 */
export interface IPlacedWallComponent extends IWallComponent {
    getModel(): Object3D | undefined;
    getPosition(): Vector3;
}
