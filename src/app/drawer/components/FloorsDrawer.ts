import { Scene, Vector3 } from "three";
import { CollisionDetector } from "./CollisionDetector";
import {IFloorCeiling} from "../objects/floor/IFloorCeiling";
import {FloorCeiling} from "../objects/floor/FloorCeiling";
import {NoFloorCeiling} from "../objects/floor/NoFloorCeiling";
import {DEFAULT_FLOOR_MATERIAL} from "../constants/Types";
import {PlacedWall} from "../objects/wall/PlacedWall";
import {ISceneObject} from "../objects/ISceneObject";

export class FloorsDrawer {

    private readonly scene: Scene;
    private readonly collisionDetector: CollisionDetector;
    private readonly placedFloors: Array<FloorCeiling>;
    private readonly placedWalls: Array<PlacedWall>;

    private drawnFloor: IFloorCeiling = NoFloorCeiling.INSTANCE;

    public constructor(
        scene: Scene,
        collisionDetector: CollisionDetector,
        floors: Array<FloorCeiling>,
        walls: Array<PlacedWall>,
    ) {
        this.scene = scene;
        this.collisionDetector = collisionDetector;
        this.placedFloors = floors;
        this.placedWalls = walls;
    }

    /**
     * Changes shape of currently drawn floor.
     * @param start pointer starting point
     * @param end pointer ending point
     */
    public changeDrawnFloor(start: Vector3, end: Vector3) {
        this.drawnFloor.uncollide(); // reset to default color
        this.drawnFloor.change(start, end);
        const checkedAgainst = [...this.placedFloors, ...this.placedWalls] as ISceneObject[];
        const collision = this.collisionDetector.detectAABBCollisions(this.drawnFloor, checkedAgainst);
        if (collision !== undefined) {
            this.drawnFloor.collide();
        }
    }

    /**
     * Returns true if floor was drawn, false if there was collision and floor could not be drawn.
     */
    public drawFloor(start: Vector3, end: Vector3): boolean {
        this.drawnFloor.uncollide(); // reset do default color
        this.drawnFloor.change(start, end);
        const checkedAgainst = [...this.placedFloors, ...this.placedWalls] as ISceneObject[];
        const collision = this.collisionDetector.detectAABBCollisions(this.drawnFloor, checkedAgainst);
        if (collision !== undefined) {
            this.drawnFloor.collide();
            return false;
        }

        const placedFloor = this.drawnFloor.place();
        this.placedFloors.push(placedFloor);
        return true;
    }

    /**
     * Creates initial floor shape which can be changed, initially no shape is available to be changed.
     */
    public initializeFloor(start: Vector3, end: Vector3) {
        this.drawnFloor = new FloorCeiling(start, end, DEFAULT_FLOOR_MATERIAL);
        this.drawnFloor.addTo(this.scene);
    }

    /**
     * Removes floor, e.g. when floor was not drawn but operation was changed.
     */
    public removeCurrentlyDrawnFloor() {
        this.drawnFloor.removeFrom(this.scene);
        this.drawnFloor = NoFloorCeiling.INSTANCE;
    }
}
