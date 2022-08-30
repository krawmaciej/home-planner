import {Color, GridHelper} from "three";
import {ObjectElevation} from "../../drawer/constants/Types";
import {CanvasState} from "./CanvasDefaults";

export const initializeWithFloorPlan = ({ scene }: CanvasState) => {
    scene.background = new Color(0x999999);

    const grid = new GridHelper(100, 100, 0xbbbbbb, 0xbbbbbb);
    grid.position.setY(ObjectElevation.GRID);
    scene.add(grid);
};
