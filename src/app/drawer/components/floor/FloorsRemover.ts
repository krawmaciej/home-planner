import {Scene, Vector3} from "three";
import {CollisionDetector} from "../CollisionDetector";
import {FloorCeiling} from "../../objects/floor/FloorCeiling";
import {IObjectRemover} from "../IObjectRemover";

export class FloorsRemover implements IObjectRemover{

    private readonly scene: Scene;
    private readonly collisionDetector: CollisionDetector;
    private readonly floors: Array<FloorCeiling>;

    private currentlySelected: FloorCeiling | undefined;

    public constructor(scene: Scene, collisionDetector: CollisionDetector, floors: Array<FloorCeiling>) {
        this.scene = scene;
        this.collisionDetector = collisionDetector;
        this.floors = floors;
    }

    public removeAt(position: Vector3) {
        const selected = this.collisionDetector.pickRectangularObjectWithPointer(position, this.floors);
        if (selected === undefined) {
            return;
        }

        const indexOf = this.floors.indexOf(selected);
        if (indexOf === -1) {
            throw new Error(`Removing floor from list that doesn't contain that floor.`);
        }
        this.floors.splice(indexOf, 1);
        selected.removeFrom(this.scene);
    }

    public selectAt(position: Vector3) {
        this.currentlySelected?.unHighlight();
        const selected = this.collisionDetector.pickRectangularObjectWithPointer(position, this.floors);
        selected?.highlight();
        this.currentlySelected = selected;
    }
}
