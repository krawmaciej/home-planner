import { IWallComponent } from "./IWallComponent";

/**
 * Placed wall component exists only if it has a placed parent wall.
 * However not all components that have parent walls are placed components.
 */
export interface IPlacedWallComponent extends IWallComponent {
}
