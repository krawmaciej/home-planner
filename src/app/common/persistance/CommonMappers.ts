import {MeshStandardMaterial, Vector3} from "three";
import {Vector2D} from "../../drawer/constants/Types";

export type PersistedVector3 = {
    x: number,
    y: number,
    z: number,
}

export type PersistedVector2D = {
    x: string,
    z: string,
}

export const toVector3 = (persisted: PersistedVector3): Vector3 => {
    return new Vector3(persisted.x, persisted.y, persisted.z);
};

export const persistVector2D = (vector2d: Vector2D): PersistedVector2D => {
    return {
        x: vector2d.x.toString(),
        z: vector2d.z.toString(),
    };
};

export const persistMaterialColor = (material: MeshStandardMaterial): string => {
    return "#" + material.color.getHexString();
};
