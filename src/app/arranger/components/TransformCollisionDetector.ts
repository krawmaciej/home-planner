import {deregisterObserver, ICanvasObserver, registerObserver} from "../../common/canvas/ICanvasObserver";
import {ObjectProps} from "../objects/ImportedObject";
import {findHalfOfObjectHeight} from "./ObjectOperations";

type Checked = {
    objectProps: ObjectProps,
    cachedHalfHeight: number,
}

export class TransformCollisionDetector implements ICanvasObserver {

    private readonly wallSize: number;
    private readonly canvasObservers: Array<ICanvasObserver>;
    private checked: Checked | undefined;

    public constructor(wallSize: number, observers: Array<ICanvasObserver>) {
        this.wallSize = wallSize;
        this.canvasObservers = observers;
    }

    public beforeRender(): void {
        if (this.checked === undefined) {
            return; // no op
        }
        this.resolveFloorAndCeilingCollisions(this.checked);
    }

    private resolveFloorAndCeilingCollisions(checked: Checked) {
        const object3d = checked.objectProps.object3d;
        const halfHeight = checked.cachedHalfHeight;
        if (object3d.position.y - halfHeight < 0) {
            object3d.position.y = halfHeight;
        } else if (object3d.position.y + halfHeight > this.wallSize) {
            object3d.position.y = this.wallSize - halfHeight;
        }
    }

    public setObject(objectProps: ObjectProps) {
        this.checked = {
            objectProps: objectProps,
            cachedHalfHeight: findHalfOfObjectHeight(objectProps.object3d),
        };
        registerObserver(this.canvasObservers, this);
    }

    public unsetObject() {
        this.checked = undefined;
        deregisterObserver(this.canvasObservers, this);
    }
}
