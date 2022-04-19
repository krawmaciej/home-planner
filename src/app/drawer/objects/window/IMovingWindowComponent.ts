import { IPlacedWindowComponent } from "./IPlacedWindowComponent";
import { IWallComponent } from "./IWallComponent";

export interface IMovingWindowComponent extends IWallComponent {
    createPlacedComponent(): IPlacedWindowComponent;
    unsetParentWall(): void;
}
