import {IPlacedWallComponent} from "../../objects/component/IPlacedWallComponent";
import {IObjectRemover} from "../IObjectRemover";
import {Scene, Vector3} from "three";
import {CollisionDetector} from "../CollisionDetector";

export class WallComponentRemover implements IObjectRemover {

    private readonly scene: Scene;
    private readonly collisionDetector: CollisionDetector;
    private readonly wallComponents: Array<IPlacedWallComponent>;

    private currentlySelected: IPlacedWallComponent | undefined;

    public constructor(scene: Scene, collisionDetector: CollisionDetector, wallComponents: Array<IPlacedWallComponent>) {
        this.scene = scene;
        this.collisionDetector = collisionDetector;
        this.wallComponents = wallComponents;
    }

    public removeAt(position: Vector3): void {
        const selected = this.collisionDetector.pickRectangularObjectWithPointer(position, this.wallComponents);
        if (selected === undefined) {
            return;
        }

        const parentWall = selected.getParentWall();
        if (parentWall === undefined) {
            throw new Error(`Removing wall component that has no parent wall.`);
        }

        parentWall.removeComponent(selected);

        const index = this.wallComponents.indexOf(selected);
        if (index === -1) {
            throw new Error(`Removing wall component from list that doesn't contain this component.`);
        }
        this.wallComponents.splice(index, 1);
        selected.removeFrom(this.scene);
    }

    public selectAt(position: Vector3): void {
        this.currentlySelected?.unHighlight();
        const selected = this.collisionDetector.pickRectangularObjectWithPointer(position, this.wallComponents);
        selected?.highlight();
        this.currentlySelected = selected;
    }
}
