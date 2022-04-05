import { Scene, Vector3 } from "three";
import PlacedWall from "../objects/wall/PlacedWall";
import WallComponent from "../objects/window/WallComponent";
import WindowComponent, { WindowProps } from "../objects/window/WindowComponent";
import CollisionDetector from "./CollisionDetector";

export default class WallComponentAdder {

    private readonly scene: Scene;
    private readonly collisionDetector: CollisionDetector;
    private readonly placedWalls: Array<PlacedWall>; // used to detect collisions with walls
    private readonly wallComponents: Array<WallComponent>; // used to detect collisions with other components

    private currentComponent: WindowComponent | undefined;

    public constructor(
        scene: Scene,
        collisionDetector: CollisionDetector,
        placedWalls: Array<PlacedWall>,
        wallComponents: Array<WallComponent>,
    ) {
        this.scene = scene;
        this.collisionDetector = collisionDetector;
        this.placedWalls = placedWalls;
        this.wallComponents = wallComponents;
    }

    public setComponent(windowProps: WindowProps) {
        this.removeMovingComponent();
        this.currentComponent = new WindowComponent(windowProps);
    }
    
    public showMovingComponent(point: Vector3) {
        this.moveComponent(point);
        this.currentComponent?.addTo(this.scene);
    }

    public moveComponent(point: Vector3) {
        this.currentComponent?.changePosition(point);
    }

    public addComponentToWall(point: Vector3) {
        if (this.currentComponent === undefined) {
            return;
        }
        this.moveComponent(point);
        const newComponent = new WindowComponent(this.currentComponent.props);
        newComponent.changePosition(point); // todo: clone current component or something
        newComponent.addTo(this.scene);
        this.wallComponents.push(newComponent);
    }

    /**
     * When component is being moved and other one was selected.
     */
    public removeMovingComponent() {
        this.currentComponent?.removeFrom(this.scene);
        this.currentComponent = undefined;
    }
}
