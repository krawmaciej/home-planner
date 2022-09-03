import {IInputHandler} from "../../../common/canvas/inputHandler/IInputHandler";
import {Camera, Object3D, Raycaster, Scene} from "three";
import {InputPoint} from "../../../common/canvas/inputHandler/MainInputHandler";
import {ObjectProps} from "../../objects/ImportedObject";

export class SelectObjectIH implements IInputHandler {

    private readonly raycaster: Raycaster;
    private readonly camera: Camera;
    private readonly placedObjectsMap: Map<Object3D, ObjectProps>;

    public constructor(camera: Camera, placedObjects: Array<ObjectProps>) {
        this.camera = camera;
        this.raycaster = new Raycaster();
        this.placedObjectsMap = SelectObjectIH.createPlacedObjectsMap(placedObjects);
    }

    private static createPlacedObjectsMap(placedObjects: Array<ObjectProps>) {
        const resultMap = new Map<Object3D, ObjectProps>();
        placedObjects.forEach(value => resultMap.set(value.object3d, value));
        return resultMap;
    }

    public handleCancel(): void {
    }

    public handleClick({ canvasCoords }: InputPoint): void {
        console.log(`handled click with ${JSON.stringify(canvasCoords)}`);
        this.raycaster.setFromCamera(canvasCoords, this.camera);
        const intersections = this.raycaster.intersectObjects([...this.placedObjectsMap.keys()], true);
        if (intersections.length > 0) {
            let intersectedPrevParent = intersections[0].object;
            let intersectedParent = intersections[0].object.parent;
            while (!((intersectedParent === null) || intersectedParent instanceof Scene)) {
                intersectedPrevParent = intersectedParent;
                intersectedParent = intersectedParent.parent;
            }

            if (intersectedPrevParent) {
                const objectProps = this.placedObjectsMap.get(intersectedPrevParent);
                console.log(`intersected props ${JSON.stringify(objectProps?.name)}`);
            }
        }
    }

    public handleMovement({ canvasCoords }: InputPoint): void {
    }
}
