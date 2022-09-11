import {Scene, Vector3} from "three";
import {PlacedWall} from "../objects/wall/PlacedWall";
import {IWallComponent} from "../objects/component/IWallComponent";
import {WallComponent, ComponentProps} from "../objects/component/WallComponent";
import {ALL_SIDES, CollisionDetector} from "./CollisionDetector";
import {NoMovingWallComponent} from "../objects/component/NoMovingWallComponent";
import {IMovingWallComponent} from "../objects/component/IMovingWallComponent";
import {IPlacedWallComponent} from "../objects/component/IPlacedWallComponent";
import {Direction} from "../objects/wall/Direction";
import {CommonMathOperations} from "../../common/components/CommonMathOperations";

export class WallComponentAdder {

    private readonly scene: Scene;
    private readonly collisionDetector: CollisionDetector;
    private readonly placedWalls: Array<PlacedWall>; // used to detect collisions with walls
    private readonly placedWallComponents: Array<IPlacedWallComponent>; // used to detect collisions with other components

    private movingComponent: IMovingWallComponent = NoMovingWallComponent.getInstance();
    private orientingComponent: IPlacedWallComponent | undefined;
    private snapStep: number;

    public constructor(
        scene: Scene,
        collisionDetector: CollisionDetector,
        placedWalls: Array<PlacedWall>,
        wallComponents: Array<IPlacedWallComponent>,
        snapStep: number,
    ) {
        this.scene = scene;
        this.collisionDetector = collisionDetector;
        this.placedWalls = placedWalls;
        this.placedWallComponents = wallComponents;
        this.snapStep = snapStep;
    }

    public setWindow(windowProps: ComponentProps) {
        this.movingComponent = WallComponent.createMovingWindow(windowProps);
    }

    public setDoor(windowProps: ComponentProps) {
        this.movingComponent = WallComponent.createMovingDoor(windowProps);
    }

    public showMovingComponent(position: Vector3) {
        this.movingComponent.changePosition(position);
        this.movingComponent.addTo(this.scene);
    }

    public moveComponent(position: Vector3): IWallComponent {
        this.movingComponent.setNotCollided(); // reset to default color

        // check whether component is placed above wall
        const parentWall = this.collisionDetector.pickRectangularObjectWithPointer(position, this.placedWalls);
        if (parentWall === undefined) {
            this.movingComponent.changePosition(position);
            this.movingComponent.unsetParentWall();
            return this.movingComponent; // no wall owner, do nothing
        }

        this.movingComponent.setParentWall(parentWall);
        this.movingComponent.changePosition(position);

        const currentDistance = this.movingComponent.getDistanceFromParentWall() ?? 0;
        const newDistance = Math.floor(currentDistance / this.snapStep) * this.snapStep;
        this.movingComponent.setDistanceFromParentWall(newDistance);

        // check whether parent wall is smaller than component
        const wallWidth = parentWall.getWidth();
        const componentWidth = this.movingComponent.getWidth();
        if (!CommonMathOperations.areNumbersEqual(wallWidth, componentWidth) && wallWidth < componentWidth) {
            this.movingComponent.setCollided();
            return this.movingComponent; // wall is smaller than component, do nothing
        }

        // check whether component collides with other components
        const componentCollision = this.collisionDetector
            .detectCollisions(this.movingComponent.getObjectPointsOnScene(), this.placedWallComponents, ALL_SIDES);
        if (componentCollision.isCollision) {
            this.movingComponent.setCollided();
            return this.movingComponent; // collides with another component, do nothing
        }

        // check whether component collides with adjacent walls
        const adjacentCollisions =
            this.collisionDetector.detectComponentToWallCollisions(this.movingComponent, this.placedWalls);
        if (adjacentCollisions.adjacentObjects.length > 0 || adjacentCollisions.isCollision) {
            this.movingComponent.setCollided();
            return this.movingComponent;
        }

        return this.movingComponent;
    }

    public addComponentToWall(position: Vector3): boolean {
        if (this.movingComponent === undefined) {
            return false;
        }

        // check wall collision
        const component = this.moveComponent(position); // move moving component so that it appears in same place as placed
        const parentWall = component.getParentWall();
        if (parentWall === undefined || component.collides()) {
            return false;
        }

        const placedComponent: IPlacedWallComponent = this.movingComponent.createPlacedComponent(parentWall);
        placedComponent.addTo(this.scene); // first add to scene so that component has world coordinates
        parentWall.addComponent(placedComponent);
        this.placedWallComponents.push(placedComponent);
        this.orientingComponent = placedComponent;
        this.movingComponent.removeFrom(this.scene);
        return true;
    }

    /**
     * When component is being moved and other one was selected.
     */
    public removeMovingComponent() {
        this.movingComponent.removeFrom(this.scene);
        this.movingComponent = NoMovingWallComponent.getInstance();
    }

    /**
     * When component is being oriented and other one was selected.
     */
    public removeOrientingComponent() {
        if (this.orientingComponent !== undefined) {
            this.orientingComponent.removeFrom(this.scene);
            this.orientingComponent.getParentWall()?.removeComponent(this.orientingComponent);
            const index = this.placedWallComponents.indexOf(this.orientingComponent);
            if (index === -1) {
                throw new Error(`orienting component: ${JSON.stringify(this.orientingComponent)} was not found: ${JSON.stringify(this)}`);
            }
            this.placedWallComponents.splice(index, 1);
            this.orientingComponent = undefined;
        }
    }

    /**
     * Change orientation of component placed on a wall.
     * @param point direction of an orientation
     */
    public orientComponent(point: Vector3) {
        if (this.orientingComponent === undefined) {
            return;
        }
        if (this.orientingComponent.getOrientation() === Direction.DOWN ||
            this.orientingComponent.getOrientation() === Direction.UP) {
            if (point.z > this.orientingComponent.getPosition().z) {
                this.orientingComponent.changeOrientation(Direction.DOWN);
            } else {
                this.orientingComponent.changeOrientation(Direction.UP);
            }
        } else {
            if (point.x > this.orientingComponent.getPosition().x) {
                this.orientingComponent.changeOrientation(Direction.RIGHT);
            } else {
                this.orientingComponent.changeOrientation(Direction.LEFT);
            }
        }
    }

    public getSnapStep(): number {
        return this.snapStep;
    }

    public setSnapStep(snapStep: number): void {
        this.snapStep = snapStep;
    }
}
