import {Box3, Object3D, Scene, Vector3} from "three";

export class ObjectAdder {
    private readonly scene: Scene;
    private readonly placedObjects: Array<Object3D<any>>;

    public constructor(scene: Scene, placedObjects: Array<Object3D<any>>) {
        this.scene = scene;
        this.placedObjects = placedObjects;
    }

    public add(object3d: Object3D<any>) {
        const placedObject = object3d.clone();
        this.scene.add(placedObject);
        ObjectAdder.alignObjectBottomWithFloor(placedObject);
        this.placedObjects.push(placedObject);
    }

    private static alignObjectBottomWithFloor(placedObject: Object3D<any>) {
        const box3 = new Box3().setFromObject(placedObject);
        const box3Size = box3.getSize(new Vector3());
        placedObject.translateY(box3Size.y / 2);
    }
}
