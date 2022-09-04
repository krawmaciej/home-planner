import {IInputHandler} from "../../../common/canvas/inputHandler/IInputHandler";
import {Camera, Object3D, Raycaster, Scene} from "three";
import {InputPoint} from "../../../common/canvas/inputHandler/MainInputHandler";
import {ConvertedPlanObject} from "../../objects/ConvertedPlanObject";

export class SelectObjectIH implements IInputHandler {

    private readonly raycaster: Raycaster;
    private readonly camera: Camera;
    private readonly objectsMap: Map<Object3D, ConvertedPlanObject>;
    private readonly setIndexSelection: (value: number) => void;

    public constructor(camera: Camera, objects: Array<ConvertedPlanObject>, setIndexSelection: (value: number) => void) {
        this.camera = camera;
        this.raycaster = new Raycaster();
        this.objectsMap = SelectObjectIH.createObjectsMap(objects);
        this.setIndexSelection = setIndexSelection;
    }

    private static createObjectsMap(objects: Array<ConvertedPlanObject>) {
        const resultMap = new Map<Object3D, ConvertedPlanObject>();
        objects.forEach(value => resultMap.set(value.object3d, value));
        return resultMap;
    }

    public handleCancel(): void {
    }

    public handleClick({ canvasCoords }: InputPoint): void {
        // console.log(`handled click with ${JSON.stringify(canvasCoords)}`);
        this.raycaster.setFromCamera(canvasCoords, this.camera);
        const intersections = this.raycaster.intersectObjects([...this.objectsMap.keys()], true);
        // console.log("found intersections: ", intersections);
        if (intersections.length > 0) {
            let intersectedPrevParent = intersections[0].object;
            let intersectedParent = intersections[0].object.parent;
            while (!((intersectedParent === null) || intersectedParent instanceof Scene)) {
                intersectedPrevParent = intersectedParent;
                intersectedParent = intersectedParent.parent;
            }

            // console.log("parent: ", intersectedParent);
            // console.log("prevParent: ", intersectedPrevParent);

            if (intersectedPrevParent) {
                const convertedPlanObject = this.objectsMap.get(intersectedPrevParent);
                console.log("Found converted plan object!!", convertedPlanObject);
                const values = [...this.objectsMap.values()];
                for (let i = 0; i < values.length; i++) {
                    if (values[i] === convertedPlanObject) {
                        this.setIndexSelection(i);
                    }
                }
            }
        }
    }

    public handleMovement({ canvasCoords }: InputPoint): void {
        // todo: highlight object that has a pointer on it
    }
}
