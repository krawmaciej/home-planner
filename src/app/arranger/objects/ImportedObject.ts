import {Object3D} from "three";

export type ObjectProps = {
    readonly name: string,
    readonly thumbnail: string,
    readonly object3d: Object3D,
}
