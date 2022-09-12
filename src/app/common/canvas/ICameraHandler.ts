import {Camera, Light, OrthographicCamera, PerspectiveCamera, Vector3} from "three";

export interface ICameraHandler {
    getCamera(): Camera;
    setAspectRatio(aspect: number): ICameraHandler;
}

export class OrthographicCameraHandler implements ICameraHandler {

    private readonly camera: OrthographicCamera;
    private readonly frustumSize: number;

    public constructor(camera: OrthographicCamera, frustumSize: number = 18) {
        this.camera = camera;
        this.frustumSize = frustumSize;
    }

    getCamera(): OrthographicCamera {
        return this.camera;
    }

    setLookAt(position: Vector3): ICameraHandler {
        this.camera.lookAt(position);
        return this;
    }

    setPosition(position: Vector3): ICameraHandler {
        this.camera.position.copy(position);
        return this;
    }

    setZoom(zoom: number): ICameraHandler {
        this.camera.zoom = zoom;
        this.camera.updateProjectionMatrix();
        return this;
    }

    setAspectRatio(aspect: number): ICameraHandler {
        this.camera.left = -this.frustumSize * aspect / 2;
        this.camera.right = this.frustumSize * aspect / 2;
        this.camera.top = this.frustumSize / 2;
        this.camera.bottom = -this.frustumSize / 2;
        this.camera.updateProjectionMatrix();
        return this;
    }
}

export class PerspectiveCameraHandler implements ICameraHandler {

    private readonly camera: PerspectiveCamera;
    private readonly pointLight: Light;

    public constructor(camera: PerspectiveCamera, pointLight: Light, rotateOnYAxis: number) {
        this.camera = camera;
        this.pointLight = pointLight;
        this.camera.add(pointLight);
        this.camera.rotateY(rotateOnYAxis);
    }

    getCamera(): Camera {
        return this.camera;
    }

    setLookAt(position: Vector3): ICameraHandler {
        this.camera.lookAt(position);
        return this;
    }

    setPosition(position: Vector3): ICameraHandler {
        this.camera.position.copy(position);
        return this;
    }

    setZoom(zoom: number): ICameraHandler {
        this.camera.zoom = zoom;
        this.camera.updateProjectionMatrix();
        return this;
    }

    setAspectRatio(aspect: number): ICameraHandler {
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        return this;
    }
}
