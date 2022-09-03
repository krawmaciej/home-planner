import {Box3, Object3D, Scene, Vector3} from "three";

export class ObjectAdder {
    private readonly scene: Scene;
    private readonly placedObjects: Array<Object3D<any>>;
    private readonly updatePlacedObjectsToggle: (value: (prev: boolean) => boolean) => void;

    public constructor(scene: Scene, placedObjects: Array<Object3D<any>>, updatePlacedObjectsToggle: (value: (prev: boolean) => boolean) => void) {
        this.scene = scene;
        this.placedObjects = placedObjects;
        this.updatePlacedObjectsToggle = updatePlacedObjectsToggle;
    }

    /**
     * Adds object3D to scene and updates placedObjects array.
     * Returns index of newly added object3D in placedObjects array.
     * @param object3d
     */
    public add(object3d: Object3D<any>): number {
        const placedObject = object3d.clone();
        this.scene.add(placedObject);
        ObjectAdder.alignObjectBottomWithFloor(placedObject);
        this.placedObjects.push(placedObject);
        this.updatePlacedObjectsToggle(prev => !prev);
        return this.placedObjects.indexOf(placedObject);
    }

    private static alignObjectBottomWithFloor(placedObject: Object3D<any>) {
        const box3 = new Box3().setFromObject(placedObject);
        const box3Size = box3.getSize(new Vector3());
        placedObject.translateY(box3Size.y / 2);
    }
}
