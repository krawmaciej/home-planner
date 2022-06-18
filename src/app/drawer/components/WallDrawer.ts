import { Scene, Vector3 } from "three";
import { ObjectElevation } from "../constants/Types";
import { WallBuilder } from "../objects/wall/WallBuilder";
import { IDrawnWall } from "../objects/wall/IDrawnWall";
import { NoDrawnWall } from "../objects/wall/NoDrawnWall";
import { WallThickness } from "../objects/wall/WallThickness";
import { CollisionDetector } from "./CollisionDetector";
import { PlacedWall } from "../objects/wall/PlacedWall";
import {Floor} from "../objects/floor/Floor";
import {IPlacedWallComponent} from "../objects/window/IPlacedWallComponent";

export class WallDrawer {

    private readonly scene: Scene;
    private readonly collisionDetector: CollisionDetector;
    private readonly placedWalls: Array<PlacedWall>;
    private readonly updateWallsToggle: React.Dispatch<React.SetStateAction<boolean>>; // todo: refactor to placed walls domain object
    private readonly components: Array<IPlacedWallComponent>;
    private readonly floors: Array<Floor>;

    private wallThickness: WallThickness;
    private wallHeight: number;
    private drawnWall: IDrawnWall = NoDrawnWall.getInstance(); // after wall is drawn there is no more wall being drawn

    public constructor(
        scene: Scene,
        collisionDetector: CollisionDetector,
        walls: Array<PlacedWall>,
        updateWallsToggle: React.Dispatch<React.SetStateAction<boolean>>,
        components: Array<IPlacedWallComponent>,
        floors: Array<Floor>,
        wallThickness: WallThickness,
        wallHeight: number,
    ) {
        this.scene = scene;
        this.collisionDetector = collisionDetector;
        this.placedWalls = walls;
        this.updateWallsToggle = updateWallsToggle;
        this.components = components;
        this.floors = floors;
        this.wallThickness = wallThickness;
        this.wallHeight = wallHeight;
    }

    /**
     * Draw wall which is being currently drawn by the user.
     * @param start pointer starting point
     * @param end pointer ending point
     */
    public moveDrawedWall(start: Vector3, end: Vector3) {
        start.y = ObjectElevation.MOVING;
        end.y = ObjectElevation.MOVING;

        const wallBuilder = WallBuilder.createWall(start, end, this.wallThickness, this.wallHeight);

        const wallToWallCollision =
            this.collisionDetector.detectCollisions(wallBuilder.getProps().points, this.placedWalls);

        wallBuilder.setCollisionWithWall(wallToWallCollision); // always set to get contact points

        const wallToComponentCollision =
            this.collisionDetector.detectWallComponentCollisions(wallBuilder.getProps(), this.components);

        if (wallToComponentCollision.isCollision || wallToComponentCollision.adjacentObjects.length > 0) {
            wallBuilder.setCollisionWithObject(true); // also set component collisions
        }

        const wallToFloorCollision =
            this.collisionDetector.detectAABBCollisionsForObjectPoints(wallBuilder.getProps().points, this.floors);

        if (wallToFloorCollision !== undefined) {
            wallBuilder.setCollisionWithObject(true); // also set component collisions
        }

        const dWall = wallBuilder.createDrawnWall();

        this.drawnWall.removeFrom(this.scene);
        this.scene.add(dWall.wall);
        this.drawnWall = dWall;
    }

    public drawWall(start: Vector3, end: Vector3): boolean {
        start.y = ObjectElevation.WALL;
        end.y = ObjectElevation.WALL;
        const wallBuilder = WallBuilder.createWall(start, end, this.wallThickness, this.wallHeight);

        const collisionResult = this.collisionDetector
            .detectCollisions(wallBuilder.getProps().points, this.placedWalls);

        this.drawnWall.removeFrom(this.scene);
        this.drawnWall = NoDrawnWall.getInstance();
        
        if (collisionResult.isCollision) {
            return false; // do not place the wall
        }

        const wallToComponentCollision =
            this.collisionDetector.detectWallComponentCollisions(wallBuilder.getProps(), this.components);

        if (wallToComponentCollision.isCollision || wallToComponentCollision.adjacentObjects.length > 0) {
            return false; // do not place the wall
        }

        const wallToFloorCollision =
            this.collisionDetector.detectAABBCollisionsForObjectPoints(wallBuilder.getProps().points, this.floors);

        if (wallToFloorCollision !== undefined) {
            return false;
        }

        const placedWall = wallBuilder.setCollisionWithWall(collisionResult).createPlacedWall();

        collisionResult.adjacentObjects.forEach(aw => {
            const collision = this.collisionDetector
                .detectCollisions(aw.adjacent.getObjectPointsOnScene(), [ placedWall ]);
            if (collision.adjacentObjects.length !== 1) {
                throw new Error("Collided wall should also collide with new wall but did not!");
            }
            const { toSide, points } = collision.adjacentObjects[0];
            const replaced = aw.adjacent.collidedWithWall(toSide, points);

            aw.adjacent.removeFrom(this.scene);
            replaced.addTo(this.scene);

            const index = this.placedWalls.indexOf(aw.adjacent); // replace in array
            this.placedWalls[index] = replaced;
        });

        placedWall.addTo(this.scene);
        this.placedWalls.push(placedWall);
        this.updateWallsToggle(prev => !prev);
        return true;
    }

    public removeDrawnWall() {
        this.drawnWall.removeFrom(this.scene);
        this.drawnWall = NoDrawnWall.getInstance();
    }
}
