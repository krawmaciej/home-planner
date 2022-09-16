import {IObjectRemover} from "../IObjectRemover";
import {Scene, Vector3} from "three";
import {ALL_SIDES, CollisionDetector} from "../CollisionDetector";
import {PlacedWall} from "../../objects/wall/PlacedWall";
import {IPlacedWallComponent} from "../../objects/component/IPlacedWallComponent";

export class WallRemover implements IObjectRemover {

    private readonly scene: Scene;
    private readonly collisionDetector: CollisionDetector;
    private readonly placedWalls: Array<PlacedWall>;
    private readonly wallComponents: Array<IPlacedWallComponent>;

    private currentlySelected: PlacedWall | undefined;

    public constructor(scene: Scene,
                       collisionDetector: CollisionDetector,
                       placedWalls: Array<PlacedWall>,
                       wallComponents: Array<IPlacedWallComponent>) {
        this.scene = scene;
        this.collisionDetector = collisionDetector;
        this.placedWalls = placedWalls;
        this.wallComponents = wallComponents;
    }

    public removeAt(position: Vector3): void {
        const selected = this.collisionDetector.pickRectangularObjectWithPointer(position, this.placedWalls);
        if (selected === undefined) {
            return;
        }

        const wallComponentsToRemove = [...selected.wallComponents];
        wallComponentsToRemove.forEach(wc => this.removeWallComponents(wc, selected));

        const collisionResult = this.collisionDetector
            .detectCollisions(selected.getObjectPointsOnScene(), this.placedWalls, ALL_SIDES);

        collisionResult.adjacentObjects.forEach(ao => ao.)

        selected.removeFrom(this.scene);
        const index = this.placedWalls.indexOf(selected);
        if (index === -1) {
            throw new Error(`Wall to remove was not found in placed walls list.`);
        }
        this.placedWalls.splice(index, 1);
    }

    public selectAt(position: Vector3): void {
        this.currentlySelected?.unHighlight();
        const selected = this.collisionDetector.pickRectangularObjectWithPointer(position, this.placedWalls);
        selected?.highlight();
        this.currentlySelected = selected;
    }

    private removeWallComponents(wc: IPlacedWallComponent, selected: PlacedWall) {
        wc.removeFrom(this.scene);
        selected.removeComponent(wc);

        const index = this.wallComponents.indexOf(wc);
        if (index === -1) {
            throw new Error(`Wall component not found in wall component list during parent wall removal.`);
        }
        this.wallComponents.splice(index, 1);
    }
}
