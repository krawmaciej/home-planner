import {BufferGeometry, Material, Mesh} from "three";
import {WallFaceMesh} from "./WallFaceMesh";

/**
 * Wraps {@link Mesh} -> {@link WallFaceMesh} map to allow faster domain object lookup.
 */
export class SceneWallFaceMeshes {

    public readonly meshToWallFaceMap = new Map<Mesh<BufferGeometry, Material>, WallFaceMesh>();

    public put(meshes: Array<WallFaceMesh>) {
        meshes.forEach(wf => this.meshToWallFaceMap.set(wf.mesh, wf));
    }

    public meshes(): Array<Mesh<BufferGeometry, Material>> {
        return [...this.meshToWallFaceMap.keys()];
    }
}
