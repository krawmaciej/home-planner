import {Mesh, MeshStandardMaterial, ShapeGeometry} from "three";
import {WallFace} from "../../drawer/objects/wall/WallSide";

export type WallFaceMesh = {
    readonly object3d: Mesh<ShapeGeometry, MeshStandardMaterial>,
    readonly wallFace: WallFace,
    readonly initialTextureRotation: number,
}

export const createWallFaceMesh = (
    geometry: ShapeGeometry,
    wallFace: WallFace,
    angle: number,
    textureRotation: number,
): WallFaceMesh => {
    const mesh = new Mesh(geometry, wallFace.connection.material);
    mesh.position.copy(wallFace.firstPoint); // move to correct position - geometry center does not change

    const axis = wallFace.secondPoint.clone().sub(wallFace.firstPoint).normalize();
    mesh.rotateOnAxis(axis, angle);

    return {
        object3d: mesh,
        wallFace,
        initialTextureRotation: textureRotation,
    };
};
