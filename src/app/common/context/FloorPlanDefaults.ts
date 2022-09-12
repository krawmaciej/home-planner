import {CanvasState} from "./CanvasDefaults";
import {FloorPlanState} from "../../../App";

export const initializeWithFloorPlan = (canvasState: CanvasState, floorPlanState: FloorPlanState) => {
    canvasState.scene.add(floorPlanState.grid);
};
