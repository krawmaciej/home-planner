import {Mesh, MeshStandardMaterial, Object3D} from "three";
import {PostProcessedTextureRotation} from "../../drawer/constants/Types";

export type ArrangerObject = {
    readonly object3d: Object3D,
}

/**
 * Extends {@link ArrangerObject}.
 */
export type ObjectWithEditableTexture = ArrangerObject & {
    readonly object3d: Mesh<any, MeshStandardMaterial>,
    readonly postProcessedTextureRotation: PostProcessedTextureRotation,
    readonly initialTextureRotation: number,
}
