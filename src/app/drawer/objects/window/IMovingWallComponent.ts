import {IPlacedWallComponent} from "./IPlacedWallComponent";
import {IWallComponent} from "./IWallComponent";
import {PlacedWall} from "../wall/PlacedWall";

export interface IMovingWallComponent extends IWallComponent {
    /**
     * Creates an exact clone of this component but as a placed component.
     * @param parentWall parent wall of this placed component
     */
    createPlacedComponent(parentWall: PlacedWall): IPlacedWallComponent;
    unsetParentWall(): void;
}
