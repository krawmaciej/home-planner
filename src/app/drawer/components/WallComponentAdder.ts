import { Scene, Vector3 } from "three";
import PlacedWall from "../objects/wall/PlacedWall";
import IWallComponent from "../objects/window/IWallComponent";
import WindowComponent, { WindowProps } from "../objects/window/WindowComponent";
import CollisionDetector from "./CollisionDetector";
import NoMovingWindow from "../objects/window/NoMovingWindow";
import IMovingWindowComponent from "../objects/window/IMovingWindowComponent";
import IPlacedWindowComponent from "../objects/window/IPlacedWindowComponent";

export default class WallComponentAdder {

    private readonly scene: Scene;
    private readonly collisionDetector: CollisionDetector;
    private readonly placedWalls: Array<PlacedWall>; // used to detect collisions with walls
    private readonly wallComponents: Array<IPlacedWindowComponent>; // used to detect collisions with other components

    private movingWindow: IMovingWindowComponent = NoMovingWindow.getInstance();

    public constructor(
        scene: Scene,
        collisionDetector: CollisionDetector,
        placedWalls: Array<PlacedWall>,
        wallComponents: Array<IWallComponent>,
    ) {
        this.scene = scene;
        this.collisionDetector = collisionDetector;
        this.placedWalls = placedWalls;
        this.wallComponents = wallComponents;
    }

    public setComponent(windowProps: WindowProps) {
        this.movingWindow = new WindowComponent(windowProps);
    }
    
    public showMovingComponent(position: Vector3) {
        this.movingWindow.changePosition(position);
        this.movingWindow.addTo(this.scene);
    }

    public moveComponent(position: Vector3) {
        this.movingWindow.getPointsOnPlan(position);


        this.movingWindow.changePosition(position);
    }

    public addComponentToWall(position: Vector3) {
        if (this.movingWindow === undefined) {
            return;
        }
        // if no collisions and can be added to a wall
        const placedComponent: IPlacedWindowComponent = this.movingWindow.createPlacedComponent(position);
        placedComponent.addTo(this.scene);
        this.wallComponents.push(placedComponent);
    }

    /**
     * When component is being moved and other one was selected.
     */
    public removeMovingComponent() {
        this.movingWindow.removeFrom(this.scene);
        this.movingWindow = NoMovingWindow.getInstance();
    }
}
