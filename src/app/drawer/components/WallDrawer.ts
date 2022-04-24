import { Scene, Vector3 } from "three";
import { ObjectElevation } from "../constants/Types";
import { WallBuilder } from "../objects/wall/WallBuilder";
import { IDrawedWall } from "../objects/wall/IDrawedWall";
import { NoDrawedWall } from "../objects/wall/NoDrawedWall";
import { WallThickness } from "../objects/wall/WallThickness";
import { CollisionDetector } from "./CollisionDetector";
import { PlacedWall } from "../objects/wall/PlacedWall";
import {IWallComponent} from "../objects/window/IWallComponent";

export class WallDrawer {

    private readonly scene: Scene;
    private readonly collisionDetector: CollisionDetector;
    private readonly placedWalls: Array<PlacedWall>;
    private readonly updateWallsToggle: React.Dispatch<React.SetStateAction<boolean>>; // todo: refactor to placed walls domain object
    private readonly components: Array<IWallComponent>;

    private wallThickness: WallThickness;
    private drawedWall: IDrawedWall = NoDrawedWall.getInstance(); // after wall is drawn there is no more wall being drawn

    public constructor(
        scene: Scene,
        collisionDetector: CollisionDetector,
        walls: Array<PlacedWall>,
        updateWallsToggle: React.Dispatch<React.SetStateAction<boolean>>,
        components: Array<IWallComponent>,
        wallThickness: WallThickness
    ) {
        this.scene = scene;
        this.collisionDetector = collisionDetector;
        this.placedWalls = walls;
        this.updateWallsToggle = updateWallsToggle;
        this.components = components;
        this.wallThickness = wallThickness;
    }

    /**
     * Draw wall which is being currently drawn by the user.
     * @param start pointer starting point
     * @param end pointer ending point
     */
    public moveDrawedWall(start: Vector3, end: Vector3) {
        start.y = ObjectElevation.MOVING;
        end.y = ObjectElevation.MOVING;

        const wallBuilder = WallBuilder.createWall(start, end, this.wallThickness);

        const wallToWallCollision =
            this.collisionDetector.detectCollisions(wallBuilder.getProps().points, this.placedWalls);

        wallBuilder.setCollision(wallToWallCollision); // always set to get contact points

        const wallToComponentCollision =
            this.collisionDetector.detectWallComponentCollisions(wallBuilder.getProps(), this.components);

        if (wallToComponentCollision.isCollision || wallToComponentCollision.adjacentObjects.length > 0) {
            wallBuilder.setCollisionWithComponent(wallToComponentCollision); // also set component collisions
        }

        const dWall = wallBuilder.createDrawedWall();

        this.drawedWall.removeFrom(this.scene);
        this.scene.add(dWall.wall);
        this.drawedWall = dWall;
    }

    public drawWall(start: Vector3, end: Vector3) {
        start.y = ObjectElevation.WALL;
        end.y = ObjectElevation.WALL;
        const wallBuilder = WallBuilder.createWall(start, end, this.wallThickness);

        const collisionResult = this.collisionDetector
            .detectCollisions(wallBuilder.getProps().points, this.placedWalls);
        console.log(collisionResult);

        this.drawedWall.removeFrom(this.scene);
        this.drawedWall = NoDrawedWall.getInstance();
        
        if (collisionResult.isCollision) {
            console.log("wall collides!");
            return; // do not draw the wall
        }

        const wallToComponentCollision =
            this.collisionDetector.detectWallComponentCollisions(wallBuilder.getProps(), this.components);

        if (wallToComponentCollision.isCollision || wallToComponentCollision.adjacentObjects.length > 0) {
            console.log("wall collides with component");
            return;
        }


        const placedWall = wallBuilder.setCollision(collisionResult).createPlacedWall();

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
        console.log(placedWall.props);
    }
}
