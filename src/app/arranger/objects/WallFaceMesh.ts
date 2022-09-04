import {DoubleSide, Mesh, MeshBasicMaterialParameters, ShapeGeometry} from "three";
import {WallFace} from "../../drawer/objects/wall/WallSide";
import {loadHardwoodTxt} from "../loaders/Textures";
import {ConvertedPlanObject} from "./ConvertedPlanObject";

export type WallFaceMesh = ConvertedPlanObject & {
    readonly wallFace: WallFace,
}

export const createWallFaceMesh = (
    geometry: ShapeGeometry,
    wallFace: WallFace,
    angle: number,
    txtRotation: number,
): WallFaceMesh => {
    loadHardwoodTxt().then(txt => {
        txt.repeat.set(0.1, 0.1);
        txt.rotation = txtRotation;
        wallFace.connection.material.setValues({
            map: txt,
            side: DoubleSide,
            color: 0x888888,
        } as MeshBasicMaterialParameters);

        wallFace.connection.material.needsUpdate = true;
    });
    const mesh = new Mesh(geometry, wallFace.connection.material);
    mesh.position.copy(wallFace.firstPoint); // move to correct position - geometry center does not change

    const axis = wallFace.secondPoint.clone().sub(wallFace.firstPoint).normalize();
    mesh.rotateOnAxis(axis, angle);

    return {
        object3d: mesh,
        wallFace,
    };
};
