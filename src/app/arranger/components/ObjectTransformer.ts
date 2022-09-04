import {InteriorArrangerState} from "../../../App";
import {Scene} from "three";
import {ObjectProps} from "../objects/ImportedObject";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import {TransformCollisionDetector} from "./TransformCollisionDetector";

export class ObjectTransformer {
    private readonly scene: Scene;
    private readonly orbitControls: OrbitControls;
    private readonly transformControls: TransformControls;
    private readonly collisionDetector: TransformCollisionDetector;

    public constructor(scene: Scene, { orbitControls, transformControls }: InteriorArrangerState) {
        this.scene = scene;
        this.orbitControls = orbitControls;
        this.transformControls = transformControls;
        this.collisionDetector = new TransformCollisionDetector();
    }

    public startTransforming(placedObject: ObjectProps) {
        this.transformControls.addEventListener("dragging-changed", event => {
            this.orbitControls.enabled = !event.value;
            if (placedObject.object3d.position.y < 0) {
                placedObject.object3d.position.y = 0;
            }
        });

        this.transformControls.enabled = true;
        this.transformControls.attach(placedObject.object3d);
        this.scene.add(this.transformControls);
    }

    public stopTransforming() {
        this.scene.remove(this.transformControls);
        this.transformControls.detach();
        this.transformControls.enabled = false;
    }

    public isTransforming(): boolean {
        return this.transformControls.object !== undefined;
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
        if (object !== undefined) {
            this.scene.remove(object);
        }
    }
}
