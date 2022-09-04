import {Scene} from "three";
import {ObjectProps} from "../objects/ImportedObject";
import {findHalfOfObjectHeight} from "./ObjectOperations";

export class ObjectAdder {
    private readonly scene: Scene;
    private readonly placedObjects: Array<ObjectProps>;
    private readonly updatePlacedObjectsToggle: (value: (prev: boolean) => boolean) => void;

    public constructor(scene: Scene, placedObjects: Array<ObjectProps>, updatePlacedObjectsToggle: (value: (prev: boolean) => boolean) => void) {
        this.scene = scene;
        this.placedObjects = placedObjects;
        this.updatePlacedObjectsToggle = updatePlacedObjectsToggle;
    }

    /**
     * Adds object3D to scene and updates placedObjects array.
     * Returns index of newly added object3D in placedObjects array.
     * @param objectProps
     */
    public add(objectProps: ObjectProps): number {
        const placedObject: ObjectProps = {
            ...objectProps,
            object3d: objectProps.object3d.clone()
        };
        this.scene.add(placedObject.object3d);
        ObjectAdder.alignObjectBottomWithFloor(placedObject);
        this.placedObjects.push(placedObject);
        this.updatePlacedObjectsToggle(prev => !prev);
        return this.placedObjects.indexOf(placedObject);
    }

    private static alignObjectBottomWithFloor({ object3d }: ObjectProps) {
        const halfHeight = findHalfOfObjectHeight(object3d);
        object3d.translateY(halfHeight);
    }
}
