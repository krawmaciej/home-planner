import {PersistedVector3, toVector3} from "./CommonMappers";
import {ObjectProps} from "../../arranger/objects/ImportedObject";
import {Object3D} from "three";

export type PersistedObjectProps = {
    name: string,
    thumbnail: string,
    width: number,
    thickness: number,
    height: number,
    fileIndex: number,
    position: PersistedVector3,
    rotation: PersistedVector3,
}

export const persistObjectProps = (props: ObjectProps): PersistedObjectProps => {
    return {
        fileIndex: props.fileIndex,
        height: props.height,
        name: props.name,
        thickness: props.thickness,
        thumbnail: props.thumbnail,
        width: props.width,
        position: props.object3d.position,
        rotation: props.object3d.rotation.toVector3(),
    };
};

export const toObjectProps = (persisted: PersistedObjectProps, objectDefinitions: Array<ObjectProps>): ObjectProps => {
    const restoredObject = loadObject3D(persisted, objectDefinitions);

    return {
        fileIndex: persisted.fileIndex,
        height: persisted.height,
        name: persisted.name,
        object3d: restoredObject,
        thickness: persisted.thickness,
        thumbnail: persisted.thumbnail,
        width: persisted.width,
    };
};

const loadObject3D = (persisted: PersistedObjectProps, objectDefinitions: Array<ObjectProps>): Object3D => {
    const loadedObject = objectDefinitions.at(persisted.fileIndex)?.object3d?.clone();
    if (loadedObject === undefined) {
        throw new Error(`Model for ${persisted} does not exist in model definitions.`);
    }
    loadedObject.position.copy(toVector3(persisted.position));
    loadedObject.rotation.setFromVector3(toVector3(persisted.rotation));
    return loadedObject;
};
