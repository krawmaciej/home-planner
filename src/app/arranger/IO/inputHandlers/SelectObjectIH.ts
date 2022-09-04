import {IInputHandler} from "../../../common/canvas/inputHandler/IInputHandler";
import {Camera, Object3D, Raycaster, Scene} from "three";
import {InputPoint} from "../../../common/canvas/inputHandler/MainInputHandler";
import {ObjectProps} from "../../objects/ImportedObject";

export class SelectObjectIH implements IInputHandler {

    private readonly raycaster: Raycaster;
    private readonly camera: Camera;
    private readonly placedObjectsMap: Map<Object3D, ObjectProps>;
    private readonly setIndexSelection: (value: number) => void;

    public constructor(camera: Camera, placedObjects: Array<ObjectProps>, setIndexSelection: (value: number) => void) {
        this.camera = camera;
        this.raycaster = new Raycaster();
        this.placedObjectsMap = SelectObjectIH.createPlacedObjectsMap(placedObjects);
        this.setIndexSelection = setIndexSelection;
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
                const values = [...this.placedObjectsMap.values()];
                for (let i = 0; i < values.length; i++) {
                    if (values[i] === objectProps) {
                        this.setIndexSelection(i);
                    }
                }
                console.log(`intersected props ${JSON.stringify(objectProps?.name)}`);
            }
        }
    }

    public handleMovement({ canvasCoords }: InputPoint): void {
    }
}
