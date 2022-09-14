import {PersistedVector2D, PersistedVector3, persistMaterialColor, persistVector2D} from "./CommonMappers";
import {ComponentProps, ComponentType, WallComponent} from "../../drawer/objects/component/WallComponent";
import {Object3D} from "three";
import {IPlacedWallComponent} from "../../drawer/objects/component/IPlacedWallComponent";

export type PersistedComponentProps = {
    thumbnail: string,
    name: string,
    modelFileIndex: number | undefined,
    width: number,
    thickness: number,
    height: number,
    elevation: number,
    mutableFields: PersistedComponentPropsMutableFields,
}

export type PersistedComponentPropsMutableFields = {
    width: boolean,
    height: boolean,
    elevation: boolean,
}

export type PersistedWallComponent = {
    props: PersistedComponentProps,
    position: PersistedVector3,
    orientation: PersistedVector2D,
    type: ComponentType,
    textureRotation: number,
    textureFileIndex: number | undefined,
    frameColor: string,
}

export const toComponentProps = (persisted: PersistedComponentProps, modelDefinitions: Array<ComponentProps>): ComponentProps => {
    let object3d: Object3D | undefined = undefined;
    if (persisted.modelFileIndex !== undefined) {
        const loadedObject = modelDefinitions.at(persisted.modelFileIndex)?.object3d;
        if (loadedObject === undefined) {
            throw new Error(`Model for ${persisted} does not exist in model definitions.`);
        }
        object3d = loadedObject;
    }

    return {
        elevation: persisted.elevation,
        height: persisted.height,
        mutableFields: persisted.mutableFields,
        name: persisted.name,
        thickness: persisted.thickness,
        thumbnail: persisted.thumbnail,
        fileIndex: persisted.modelFileIndex,
        object3d: object3d,
        width: persisted.width,
    };
};

export const persistComponentProps = (cp: ComponentProps): PersistedComponentProps => {
    return {
        elevation: cp.elevation,
        height: cp.height,
        mutableFields: cp.mutableFields,
        name: cp.name,
        thickness: cp.thickness,
        thumbnail: cp.thumbnail,
        modelFileIndex: cp.fileIndex,
        width: cp.width,
    };
};

export const persistWallComponent = (wc: IPlacedWallComponent): PersistedWallComponent => {
    return {
        frameColor: persistMaterialColor(wc.getFrameMaterial()),
        orientation: persistVector2D(wc.getOrientation()),
        position: wc.getPosition(),
        textureRotation: wc.getTextureProps().rotation,
        textureFileIndex: wc.getTextureProps().fileIndex,
        props: persistComponentProps((wc as WallComponent).props),
        type: wc.getType(),
    };
};
