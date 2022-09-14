import {RADIAN_MULTIPLIER} from "./CommonMathOperations";
import {MeshStandardMaterial} from "three";
import {LoadedTexture} from "../models/TextureDefinition";
import {ObjectSideOrientation} from "../../drawer/constants/Types";

export const COMPONENT_FRAME_INITIAL_TEXTURE_ROTATION = 0;
export const CEILING_INITIAL_TEXTURE_ROTATION = 0;
export const FLOOR_INITIAL_TEXTURE_ROTATION = 0;

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


export const getWallFaceTextureRotation = (orientation: ObjectSideOrientation): number => {
    if (orientation === ObjectSideOrientation.BOTTOM || orientation === ObjectSideOrientation.TOP) {
        return 0.0;
    } else {
        return Math.PI * 1.5;
    }
};
