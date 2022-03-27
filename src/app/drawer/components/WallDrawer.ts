import { Scene, Vector3 } from "three";
import { ComponentElevation, RenderOrder } from "../constants/Types";
import DrawedWall from "../objects/wall/DrawedWall";
import DrawedWallBuilder from "../objects/wall/DrawedWallBuilder";
import IDrawedWall from "../objects/wall/IDrawedWall";
import NoDrawedWall from "../objects/wall/NoDrawedWall";
import WallThickness from "../objects/wall/WallThickness";
import CollisionDetector from "./CollisionDetector";

export default class WallDrawer {

    private readonly scene: Scene;
    private readonly collisionDetector: CollisionDetector;
    private readonly testWalls: Array<DrawedWall>;
    private wallThickness: WallThickness;
    private drawedWall: IDrawedWall = NoDrawedWall.getInstance(); // after wall is drawn there is no more wall being drawn

    public constructor(
        scene: Scene,
        collisionDetector: CollisionDetector,
        walls: Array<DrawedWall>,
        wallThickness: WallThickness
    ) {
        this.scene = scene;
        this.collisionDetector = collisionDetector;
        this.testWalls = walls;
        this.wallThickness = wallThickness;
    }

    /**
     * Draw wall which is being currently drawn by the user.
     * @param start pointer starting point
     * @param end pointer ending point
     */
    public moveDrawedWall(start: Vector3, end: Vector3) {
        start.y = ComponentElevation.WALL;
        end.y = ComponentElevation.WALL;

        const wallBuilder = DrawedWallBuilder.createWall(start, end, this.wallThickness);

        const collision = this.collisionDetector.detectDrawedCollisions(wallBuilder.getProps(), this.testWalls);
        const dWall = wallBuilder.setCollided(collision).build();

        this.drawedWall.removeFrom(this.scene);
        dWall.wall.renderOrder = RenderOrder.WALL;
        this.scene.add(dWall.wall);
        this.drawedWall = dWall;
    }

    public drawWall(start: Vector3, end: Vector3) {
        start.y = ComponentElevation.WALL;
        end.y = ComponentElevation.WALL;
        const wallBuilder = DrawedWallBuilder.createWall(start, end, this.wallThickness);

        const collided = this.collisionDetector.detectDrawedCollisions(wallBuilder.getProps(), this.testWalls);
        console.log(collided);

        this.drawedWall.removeFrom(this.scene);
        
        if (collided.isCollision) {
            console.log("wall collides!");
            return; // do not draw the wall
        }

        const dWall = wallBuilder.build();


        this.scene.add(dWall.wall);
        this.testWalls.push(dWall);
        this.drawedWall = NoDrawedWall.getInstance();
    }
}
