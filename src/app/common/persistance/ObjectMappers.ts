import {PersistedVector3, toVector3} from "./CommonMappers";
import {ObjectProps} from "../../arranger/objects/ImportedObject";

export type PersistedObjectProps = {
    name: string,
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
        width: props.width,
        position: props.object3d.position,
        rotation: props.object3d.rotation.toVector3(),
    };
};

export const toObjectProps = (persisted: PersistedObjectProps, objectDefinitions: Array<ObjectProps>): ObjectProps => {
    const restoredObject = restoreObject(persisted, objectDefinitions);

    return {
        fileIndex: persisted.fileIndex,
        height: persisted.height,
        name: persisted.name,
        object3d: restoredObject.object3d,
        thickness: persisted.thickness,
        thumbnail: restoredObject.thumbnail,
        width: persisted.width,
    };
};

const restoreObject = (persisted: PersistedObjectProps, objectDefinitions: Array<ObjectProps>) => {
    const loadedDefinition = objectDefinitions.at(persisted.fileIndex);
    if (loadedDefinition === undefined) {
        throw new Error(`Definition for ${JSON.stringify(persisted)} does not exist.`);
    }
    const object3d = loadedDefinition.object3d.clone();
    object3d.position.copy(toVector3(persisted.position));
    object3d.rotation.setFromVector3(toVector3(persisted.rotation));
    const thumbnail = loadedDefinition.thumbnail;
    return { object3d, thumbnail };
};
