import { Object3D, Scene, WebGLRenderTarget } from "three";
import DrawedWall from "../wall/DrawedWall";
import IDrawedWall from "../wall/IDrawedWall";
import NoDrawedWall from "../wall/NoDrawedWall";

// todo: there might be no use for this since it is not simple to use and removal logic is still in the classes
// there might be a jump to be implemented, so that only generic add object3d is used and removed
// but still the memory cleaning will be in the objects so this handler might not be used at all
export default class SceneHandler {

    private readonly scene: Scene;

    public constructor(scene: Scene) {
        this.scene = scene;
    }

    public addObject(drawedWall: DrawedWall) {
        this.scene.add(drawedWall.wall);
    }

    public removeObject(object: Object3D) {
        this.scene.remove(object);
    }

    public removeDrawedWall(drawedWall: IDrawedWall) {
        drawedWall.removeFrom(this.scene);
    }
}
