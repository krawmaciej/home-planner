import {ICanvasObserver} from "../../common/canvas/ICanvasObserver";
import {DEFAULT_GRID, FloorPlanState, LESS_FREQUENT_GRID} from "../../../App";
import {Scene} from "three";

export class CameraZoomToGridDivisionsObserver implements ICanvasObserver {

    private static readonly ZOOM_THRESHOLD = 0.3;

    private readonly floorPlanState: FloorPlanState;
    private readonly scene: Scene;

    public constructor(floorPlanState: FloorPlanState, scene: Scene) {
        this.floorPlanState = floorPlanState;
        this.scene = scene;
    }

    public beforeRender(): void {
        const camera = this.floorPlanState.cameraHandler.getCamera();
        if (camera.zoom < CameraZoomToGridDivisionsObserver.ZOOM_THRESHOLD) {
            if (this.floorPlanState.grid !== LESS_FREQUENT_GRID) {
                this.scene.remove(this.floorPlanState.grid);
                this.scene.add(LESS_FREQUENT_GRID);
                this.floorPlanState.grid = LESS_FREQUENT_GRID;
            }
        } else {
            if (this.floorPlanState.grid === LESS_FREQUENT_GRID) {
                this.scene.remove(this.floorPlanState.grid);
                this.scene.add(DEFAULT_GRID);
                this.floorPlanState.grid = DEFAULT_GRID;
            }
        }
    }
}
