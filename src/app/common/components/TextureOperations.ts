import {RADIAN_MULTIPLIER} from "./CommonMathOperations";
import {MeshStandardMaterial} from "three";
import {LoadedTexture} from "../models/TextureDefinition";

export const setTexture = (
    texturePromise: LoadedTexture,
    material: MeshStandardMaterial,
    initialTextureRotation: number,
    textureRotation: number,
) => {
        disposeTexture(material);
        texturePromise.texture.then(txt => {
            const clonedTexture = txt.clone();
            clonedTexture.needsUpdate = true;
            clonedTexture.rotation = initialTextureRotation + (textureRotation * RADIAN_MULTIPLIER);
            material.map = clonedTexture;
            material.needsUpdate = true;
        });
};

export const disposeTexture = (material: MeshStandardMaterial) => {
    if (material.map !== null) {
        material.map.dispose();
    }
};
