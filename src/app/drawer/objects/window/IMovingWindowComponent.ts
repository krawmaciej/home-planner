import { IPlacedWindowComponent } from "./IPlacedWindowComponent";
import { IWallComponent } from "./IWallComponent";
import {PlacedWall} from "../wall/PlacedWall";

export interface IMovingWindowComponent extends IWallComponent {
    /**
     * Creates an exact clone of this component but as a placed component.
     * @param parentWall parent wall of this placed component
     */
    createPlacedComponent(parentWall: PlacedWall): IPlacedWindowComponent;
    unsetParentWall(): void;
    setDefaultColour(): void;
    setCollidedColour(): void;
}
