import { Mesh, Scene } from "three";
import Wall from "./Wall";

export default class Window {


    frame: Mesh; // holds frame reference from the wall
    window: Mesh;

    ownerWall: Wall;
    ownerScene: Scene;

    constructor(frame: Mesh, window: Mesh, ownerWall: Wall, ownerScene: Scene) {
        this.frame = frame;
        this.window = window;
        this.ownerWall = ownerWall;
        this.ownerScene = ownerScene;

    }

    public translateX(x: number) {
        this.window.translateX(x);
        this.ownerWall.updateCutFrames();
    }

    public translateY(y: number) {
        this.window.translateY(y);
        this.ownerWall.updateCutFrames();
    }

    public translateZ(z: number) {
        this.window.translateZ(z);
        this.ownerWall.updateCutFrames();
    }

    public remove() {
        this.ownerScene.remove(this.window);
    }


}