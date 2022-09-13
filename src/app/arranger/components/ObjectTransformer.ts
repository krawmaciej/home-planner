import {InteriorArrangerState} from "../../../App";
import {Scene} from "three";
import {ObjectProps} from "../objects/ImportedObject";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import {TransformCollisionDetector} from "./TransformCollisionDetector";
import {CanvasState} from "../../common/context/CanvasDefaults";
import {disposeAllProperties} from "../../common/context/SceneOperations";

export class ObjectTransformer {
    private readonly scene: Scene;
    private readonly transformControls: TransformControls;
    private readonly collisionDetector: TransformCollisionDetector;

    public constructor({ scene, observers }: CanvasState, { transformControls }: InteriorArrangerState, wallHeight: number) {
        this.scene = scene;
        this.transformControls = transformControls;
        this.collisionDetector = new TransformCollisionDetector(wallHeight, observers);
    }

    public startTransforming(placedObject: ObjectProps) {
        this.collisionDetector.setObject(placedObject);
        this.transformControls.enabled = true;
        this.transformControls.attach(placedObject.object3d);
        this.scene.add(this.transformControls);
    }

    public stopTransforming() {
        this.collisionDetector.unsetObject();
        this.scene.remove(this.transformControls); // singleton global controls, no need to dispose
        this.transformControls.detach();
        this.transformControls.enabled = false;
    }

    public setToTranslateMode() {
        this.transformControls.showX = true;
        this.transformControls.showY = true;
        this.transformControls.showZ = true;
        this.transformControls.setMode("translate");
    }

    public setToRotateMode() {
        this.transformControls.showX = false;
        this.transformControls.showY = true;
        this.transformControls.showZ = false;
        this.transformControls.setMode("rotate");
    }

    public resetTranslate() {
        this.transformControls.object?.position.set(0, 0, 0);
    }

    public resetRotation() {
        this.transformControls.object?.rotation.set(0, 0, 0);
    }

    public removeObject() {
        const object = this.transformControls.object;
        this.collisionDetector.unsetObject();
        if (object !== undefined) {
            disposeAllProperties(object);
            this.scene.remove(object);
        }
    }
}
