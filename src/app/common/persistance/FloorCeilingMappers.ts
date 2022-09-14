import {PersistedVector3, persistMaterialColor, toVector3} from "./CommonMappers";
import {FloorCeiling, FloorCeilingProps} from "../../drawer/objects/floor/FloorCeiling";

export type PersistedFloorCeilingProps = {
    start: PersistedVector3,
    end: PersistedVector3,
}

export type PersistedFloorCeiling = {
    props: PersistedFloorCeilingProps,
    floorTextureRotation: number,
    floorTextureFileIndex: number | undefined,
    floorColor: string,
    ceilingTextureRotation: number,
    ceilingTextureFileIndex: number | undefined,
    ceilingColor: string,
}

export const persistFloorCeiling = (floorCeiling: FloorCeiling): PersistedFloorCeiling => {
    return {
        ceilingColor: persistMaterialColor(floorCeiling.ceilingMaterial),
        ceilingTextureFileIndex: floorCeiling.ceilingTextureProps.fileIndex,
        ceilingTextureRotation: floorCeiling.ceilingTextureProps.rotation,
        floorColor: persistMaterialColor(floorCeiling.floorMaterial),
        floorTextureFileIndex: floorCeiling.floorTextureProps.fileIndex,
        floorTextureRotation: floorCeiling.floorTextureProps.rotation,
        props: floorCeiling.props,
    };
};

export const toFloorCeilingProps = (persisted: PersistedFloorCeilingProps): FloorCeilingProps => {
    return {
        start: toVector3(persisted.start),
        end: toVector3(persisted.end),
    };
};
