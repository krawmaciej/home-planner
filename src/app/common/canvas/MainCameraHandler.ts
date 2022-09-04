/**
 * It is stateful because it is shared in canvas.
 * (Is not a delegate itself to not allow nesting.)
 */
import {ICameraHandler} from "./ICameraHandler";
import {Camera, Vector3} from "three";

export class MainCameraHandler {

    private delegate: ICameraHandler;

    public constructor(cameraHandler: ICameraHandler) {
        this.delegate = cameraHandler;
    }

    public changeHandler(cameraHandler: ICameraHandler) {
        this.delegate = cameraHandler;
    }

    public getCamera(): Camera {
        return this.delegate.getCamera();
    }

    public setAspectRatio(aspect: number) {
        this.delegate.setAspectRatio(aspect);
    }

    public setZoom(zoom: number) {
        this.delegate.setZoom(zoom);
    }

    public setPosition(position: Vector3) {
        this.delegate.setPosition(position);
    }

    public setLookAt(position: Vector3) {
        this.delegate.setLookAt(position);
    }
}
