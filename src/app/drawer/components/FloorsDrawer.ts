import { Scene, Vector3 } from "three";
import { CollisionDetector } from "./CollisionDetector";
import {IFloor} from "../objects/floor/IFloor";
import {Floor} from "../objects/floor/Floor";
import {NoFloor} from "../objects/floor/NoFloor";
import {DEFAULT_FLOOR_MATERIAL} from "../constants/Types";

export class FloorsDrawer {

    private readonly scene: Scene;
    private readonly collisionDetector: CollisionDetector;
    private readonly placedFloors: Array<Floor>;
    // private readonly updateFloorsToggle: React.Dispatch<React.SetStateAction<boolean>>;

    private drawnFloor: IFloor = NoFloor.INSTANCE; // after wall is drawn there is no more wall being drawn

    public constructor(
        scene: Scene,
        collisionDetector: CollisionDetector,
        floors: Array<Floor>,
        // walls: Array<PlacedWall>, // todo: check collisions also against placed walls
        // updateWallsToggle: React.Dispatch<React.SetStateAction<boolean>>,
    ) {
        this.scene = scene;
        this.collisionDetector = collisionDetector;
        this.placedFloors = floors;
        // this.updateFloorsToggle = updateWallsToggle;
    }

    /**
     * Changes shape of currently drawn floor.
     * @param start pointer starting point
     * @param end pointer ending point
     */
    public changeDrawnFloor(start: Vector3, end: Vector3) {
        this.drawnFloor.uncollide(); // reset to default color
        this.drawnFloor.change(start, end);
        const collision = this.collisionDetector.detectAABBCollisions(this.drawnFloor, this.placedFloors);
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
        const collision = this.collisionDetector.detectAABBCollisions(this.drawnFloor, [...this.placedFloors]);
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
        this.drawnFloor = new Floor(start, end, DEFAULT_FLOOR_MATERIAL);
        this.drawnFloor.addTo(this.scene);
    }

    /**
     * Removes floor, e.g. when floor was not drawn but operation was changed.
     */
    public removeCurrentlyDrawnFloor() {
        this.drawnFloor.removeFrom(this.scene);
        this.drawnFloor = NoFloor.INSTANCE;
    }
}
