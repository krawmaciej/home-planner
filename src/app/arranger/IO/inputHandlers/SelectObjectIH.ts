import {IInputHandler} from "../../../common/canvas/inputHandler/IInputHandler";
import {Camera, Object3D, Raycaster, Scene} from "three";
import {InputPoint} from "../../../common/canvas/inputHandler/MainInputHandler";
import {ArrangerObject} from "../../objects/ArrangerObject";

export class SelectObjectIH implements IInputHandler {

    private readonly raycaster: Raycaster;
    private readonly camera: Camera;
    private readonly objectsMap: Map<Object3D, ArrangerObject>;
    private readonly setIndexSelection: (value: number) => void;

    public constructor(camera: Camera, objects: Array<ArrangerObject>, setIndexSelection: (value: number) => void) {
        this.camera = camera;
        this.raycaster = new Raycaster();
        this.objectsMap = SelectObjectIH.createObjectsMap(objects);
        this.setIndexSelection = setIndexSelection;
    }

    private static createObjectsMap(objects: Array<ArrangerObject>) {
        const resultMap = new Map<Object3D, ArrangerObject>();
        objects.forEach(value => resultMap.set(value.object3d, value));
        return resultMap;
    }

    public handleCancel(): void {
        // no op
    }

    public handleClick({ canvasCoords }: InputPoint): void {
        this.raycaster.setFromCamera(canvasCoords, this.camera);
        const intersections = this.raycaster.intersectObjects([...this.objectsMap.keys()], true);
        if (intersections.length > 0) {
            let intersectedPrevParent = intersections[0].object;
            let intersectedParent = intersections[0].object.parent;
            while (!((intersectedParent === null) || intersectedParent instanceof Scene)) {
                intersectedPrevParent = intersectedParent;
                intersectedParent = intersectedParent.parent;
            }

            if (intersectedPrevParent) {
                const convertedPlanObject = this.objectsMap.get(intersectedPrevParent);
                const values = [...this.objectsMap.values()];
                for (let i = 0; i < values.length; i++) {
                    if (values[i] === convertedPlanObject) {
                        this.setIndexSelection(i);
                    }
                }
            }
        }
    }

    public handleMovement(): void {
        // no op
    }
}
