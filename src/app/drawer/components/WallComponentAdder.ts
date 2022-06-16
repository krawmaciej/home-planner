import {Scene, Vector3} from "three";
import {PlacedWall} from "../objects/wall/PlacedWall";
import {IWallComponent} from "../objects/window/IWallComponent";
import {WindowComponent, WindowProps} from "../objects/window/WindowComponent";
import {CollisionDetector} from "./CollisionDetector";
import {NoMovingWindow} from "../objects/window/NoMovingWindow";
import {IMovingWindowComponent} from "../objects/window/IMovingWindowComponent";
import {IPlacedWindowComponent} from "../objects/window/IPlacedWindowComponent";

export class WallComponentAdder {

    private readonly scene: Scene;
    private readonly collisionDetector: CollisionDetector;
    private readonly placedWalls: Array<PlacedWall>; // used to detect collisions with walls
    private readonly placedWallComponents: Array<IPlacedWindowComponent>; // used to detect collisions with other components

    private movingWindow: IMovingWindowComponent = NoMovingWindow.getInstance();
    private snapStep: number;

    public constructor(
        scene: Scene,
        collisionDetector: CollisionDetector,
        placedWalls: Array<PlacedWall>,
        wallComponents: Array<IWallComponent>,
        snapStep: number,
    ) {
        this.scene = scene;
        this.collisionDetector = collisionDetector;
        this.placedWalls = placedWalls;
        this.placedWallComponents = wallComponents;
        this.snapStep = snapStep;
    }

    public setComponent(windowProps: WindowProps) {
        this.movingWindow = new WindowComponent(windowProps);
    }
    
    public showMovingComponent(position: Vector3) {
        this.movingWindow.changePosition(position);
        this.movingWindow.addTo(this.scene);
    }

    public moveComponent(position: Vector3): IWallComponent {
        this.movingWindow.setNotCollided(); // reset to default color

        // check whether component has parent wall
        const parentWall = this.collisionDetector.pickRectangularObjectWithPointer(position, this.placedWalls);
        if (parentWall === undefined) {
            this.movingWindow.changePosition(position);
            this.movingWindow.unsetParentWall();
            return this.movingWindow; // no wall owner, do nothing
        }

        this.movingWindow.setParentWall(parentWall);
        this.movingWindow.changePosition(position);

        const currentDistance = this.movingWindow.getDistanceFromParentWall() ?? 0;
        const newDistance = Math.floor(currentDistance / this.snapStep) * this.snapStep;
        this.movingWindow.setDistanceFromParentWall(newDistance);

        // check whether component collides with other components
        const componentCollision = this.collisionDetector
            .detectCollisions(this.movingWindow.getObjectPointsOnScene(), this.placedWallComponents);
        if (componentCollision.isCollision) {
            this.movingWindow.setCollided();
            return this.movingWindow; // collides with another component, do nothing
        }

        // check whether component collides with adjacent walls
        const adjacentCollisions =
            this.collisionDetector.detectComponentAdjacentWallCollisions(this.movingWindow, this.placedWalls);
        if (adjacentCollisions.adjacentObjects.length > 0 || adjacentCollisions.isCollision) {
            this.movingWindow.setCollided();
            return this.movingWindow;
        }

        return this.movingWindow;
    }

    public addComponentToWall(position: Vector3) {
        // todo: might be good idea to show to which WallSide the component will be added
        if (this.movingWindow === undefined) {
            return;
        }

        // check wall collision
        const component = this.moveComponent(position); // move moving component so that it appears in same place as placed
        const parentWall = component.getParentWall();
        if (parentWall === undefined || component.collides()) {
            return;
        }


        const placedComponent: IPlacedWindowComponent = this.movingWindow.createPlacedComponent(parentWall);
        placedComponent.addTo(this.scene); // first add to scene so that component has world coordinates
        parentWall.addComponent(placedComponent);
        this.placedWallComponents.push(placedComponent);
        console.log("parent wall with added component: ", parentWall);
    }

    /**
     * When component is being moved and other one was selected.
     */
    public removeMovingComponent() {
        this.movingWindow.removeFrom(this.scene);
        this.movingWindow = NoMovingWindow.getInstance();
    }

    public getSnapStep(): number {
        return this.snapStep;
    }

    public setSnapStep(snapStep: number): void {
        this.snapStep = snapStep;
    }
}
