import {DoubleSide, Material, Mesh, MeshBasicMaterialParameters, ShapeGeometry} from "three";
import {WallFace} from "../../drawer/objects/wall/WallSide";
import {instanceOfUvTxt} from "../components/Textures";

export class WallFaceMesh {

    public readonly mesh: Mesh<ShapeGeometry, Material>;
    public readonly wallFace: WallFace;

    public constructor(geometry: ShapeGeometry, wallFace: WallFace, angle: number, txtRotation: number) {
        instanceOfUvTxt().then(txt => {
            txt.repeat.set(0.1, 0.1);
            txt.rotation = txtRotation;
            wallFace.connection.material.setValues({
                map: txt,
                side: DoubleSide,
            } as MeshBasicMaterialParameters);
        });
        const mesh = new Mesh(geometry, wallFace.connection.material);
        mesh.position.copy(wallFace.firstPoint); // move to correct position - geometry center does not change

        const axis = wallFace.secondPoint.clone().sub(wallFace.firstPoint).normalize();
        mesh.rotateOnAxis(axis, angle);
        this.mesh = mesh;
        this.wallFace = wallFace;
    }
}
