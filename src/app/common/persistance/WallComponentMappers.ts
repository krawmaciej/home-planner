import {PersistedVector2D, PersistedVector3, persistMaterialColor, persistVector2D} from "./CommonMappers";
import {ComponentProps, ComponentType, WallComponent} from "../../drawer/objects/component/WallComponent";
import {Object3D} from "three";
import {IPlacedWallComponent} from "../../drawer/objects/component/IPlacedWallComponent";

export type PersistedComponentProps = {
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
    let thumbnail = "";
    if (persisted.modelFileIndex !== undefined) {
        const loadedDefinition = modelDefinitions.at(persisted.modelFileIndex);
        if (loadedDefinition === undefined) {
            throw new Error(`Definition for ${JSON.stringify(persisted)} does not exist.`);
        }
        object3d = loadedDefinition.object3d;
        thumbnail = loadedDefinition.thumbnail;
    }

    return {
        elevation: persisted.elevation,
        height: persisted.height,
        mutableFields: persisted.mutableFields,
        name: persisted.name,
        thickness: persisted.thickness,
        thumbnail: thumbnail,
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
