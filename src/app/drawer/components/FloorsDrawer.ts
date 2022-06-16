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
     * Draw wall which is being currently drawn by the user.
     * @param start pointer starting point
     * @param end pointer ending point
     */
    public changeDrawnFloor(start: Vector3, end: Vector3) {
        this.drawnFloor.uncollide(); // reset do default color
        this.drawnFloor.change(start, end);
        const collision = this.collisionDetector.detectAABBCollisions(this.drawnFloor, this.placedFloors);
        if (collision !== undefined) {
            this.drawnFloor.collide();
        }

        // start.y = ObjectElevation.MOVING;
        // end.y = ObjectElevation.MOVING;
        //
        // const wallBuilder = WallBuilder.createWall(start, end, this.wallThickness, this.wallHeight);
        //
        // const wallToWallCollision =
        //     this.collisionDetector.detectCollisions(wallBuilder.getProps().points, this.placedFloors);
        //
        // wallBuilder.setCollision(wallToWallCollision); // always set to get contact points
        //
        // const wallToComponentCollision =
        //     this.collisionDetector.detectWallComponentCollisions(wallBuilder.getProps(), this.components);
        //
        // if (wallToComponentCollision.isCollision || wallToComponentCollision.adjacentObjects.length > 0) {
        //     wallBuilder.setCollisionWithComponent(wallToComponentCollision); // also set component collisions
        // }
        //
        // const dWall = wallBuilder.createDrawedWall();
        //
        // this.drawnFloor.removeFrom(this.scene);
        // this.scene.add(dWall.wall);
        // this.drawnFloor = dWall;
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
        // start.y = ObjectElevation.WALL;
        // end.y = ObjectElevation.WALL;
        // const wallBuilder = WallBuilder.createWall(start, end, this.wallThickness, this.wallHeight);
        //
        // const collisionResult = this.collisionDetector
        //     .detectCollisions(wallBuilder.getProps().points, this.placedFloors);
        // console.log(collisionResult);
        //
        // this.drawnFloor.removeFrom(this.scene);
        // this.drawnFloor = NoDrawedWall.getInstance();
        //
        // if (collisionResult.isCollision) {
        //     console.log("wall collides!");
        //     return; // do not draw the wall
        // }
        //
        // const wallToComponentCollision =
        //     this.collisionDetector.detectWallComponentCollisions(wallBuilder.getProps(), this.components);
        //
        // if (wallToComponentCollision.isCollision || wallToComponentCollision.adjacentObjects.length > 0) {
        //     console.log("wall collides with component");
        //     return;
        // }
        //
        //
        // const placedWall = wallBuilder.setCollision(collisionResult).createPlacedWall();
        //
        // collisionResult.adjacentObjects.forEach(aw => {
        //     const collision = this.collisionDetector
        //         .detectCollisions(aw.adjacent.getObjectPointsOnScene(), [ placedWall ]);
        //     if (collision.adjacentObjects.length !== 1) {
        //         throw new Error("Collided wall should also collide with new wall but did not!");
        //     }
        //     const { toSide, points } = collision.adjacentObjects[0];
        //     const replaced = aw.adjacent.collidedWithWall(toSide, points);
        //
        //     aw.adjacent.removeFrom(this.scene);
        //     replaced.addTo(this.scene);
        //
        //     const index = this.placedFloors.indexOf(aw.adjacent); // replace in array
        //     this.placedFloors[index] = replaced;
        // });
        //
        // placedWall.addTo(this.scene);
        // this.placedFloors.push(placedWall);
        // this.updateFloorsToggle(prev => !prev);
        // console.log(placedWall.props);
    }

    public initializeFloor(start: Vector3, end: Vector3) {
        this.drawnFloor = new Floor(start, end, DEFAULT_FLOOR_MATERIAL);
        this.drawnFloor.addTo(this.scene);
    }
}
