import {AdjacentWallProps, WallConstruction} from "../../drawer/components/DrawerMath";
import {MeshStandardMaterial, Object3D, Vector3} from "three";
import {Direction} from "../../drawer/objects/wall/Direction";
import {ObjectSideOrientation, Vector2D} from "../../drawer/constants/Types";
import {ComponentProps, ComponentType, WallComponent} from "../../drawer/objects/component/WallComponent";
import {PlacedWall} from "../../drawer/objects/wall/PlacedWall";
import {WallFace} from "../../drawer/objects/wall/WallSide";
import {IPlacedWallComponent} from "../../drawer/objects/component/IPlacedWallComponent";

export type PersistedVector3 = {
    x: number,
    y: number,
    z: number,
}

export type PersistedVector2D = {
    x: string,
    z: string,
}

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

export type PersistedAdjacentWallProps = {
    toSide: ObjectSideOrientation,
    points: Array<PersistedVector3>,
}

export type PersistedPlacedWall = {
    props: PersistedWallConstruction,
    adjacentWallPropsList: Array<PersistedAdjacentWallProps>,
    wallSides: Array<PersistedWallSide>,
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

export type PersistedWallConstruction = {
    points: [PersistedVector3, PersistedVector3, PersistedVector3, PersistedVector3],
    middlePoints: { first: PersistedVector3, last: PersistedVector3 },
    direction: PersistedVector2D,
    width: number,
}

export const toWallConstruction = (persisted: PersistedWallConstruction): WallConstruction => {
    return {
        direction: Direction.ofStrings(persisted.direction),
        middlePoints: {
            first: toVector3(persisted.middlePoints.first),
            last: toVector3(persisted.middlePoints.last)
        },
        points: [
            toVector3(persisted.points[0]),
            toVector3(persisted.points[1]),
            toVector3(persisted.points[2]),
            toVector3(persisted.points[3]),
        ],
        width: persisted.width,
    };
};

export const toAdjacentWallPropsList = (persisted: Array<PersistedAdjacentWallProps>): Array<AdjacentWallProps> => {
    return persisted.map(p => {
        const result: AdjacentWallProps = {
            points: p.points.map(pv => toVector3(pv)),
            toSide: p.toSide,
        };
        return result;
    });
};

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

export const toVector3 = (persisted: PersistedVector3): Vector3 => {
    return new Vector3(persisted.x, persisted.y, persisted.z);
};

export const persistVector2D = (vector2d: Vector2D): PersistedVector2D => {
    return {
        x: vector2d.x.toString(),
        z: vector2d.z.toString(),
    };
};

const persistWallConstruction = (wallConstruction: WallConstruction): PersistedWallConstruction => {
    return {
        direction: persistVector2D(wallConstruction.direction),
        middlePoints: wallConstruction.middlePoints,
        points: wallConstruction.points,
        width: wallConstruction.width,
    };
};

export const persistAdjacentWallProps = (awp: AdjacentWallProps): PersistedAdjacentWallProps => {
    return { toSide: awp.toSide, points: awp.points };
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

type PersistedWallFace = {
    textureRotation: number,
    textureFileIndex: number | undefined,
    color: string,
}

type PersistedWallSide = Array<PersistedWallFace>

export const persistPlacedWall = (pw: PlacedWall): PersistedPlacedWall => {
    const persistedWallSides = new Array<PersistedWallSide>(4);

    for (const wallSide of pw.wallSides.getWallSides()) {
        persistedWallSides[wallSide.side] = wallSide.wallFaceArray().map(wf => persistWallFace(wf));
    }

    const persistedAdjacentWallPropsList = pw.adjacentWallPropsList.map(awp => persistAdjacentWallProps(awp));

    return {
        props: persistWallConstruction(pw.props),
        adjacentWallPropsList: persistedAdjacentWallPropsList,
        wallSides: persistedWallSides,
    };
};

const persistWallFace = (wallFace: WallFace): PersistedWallFace => {
    return {
        color: persistMaterialColor(wallFace.connection.material),
        textureRotation: wallFace.connection.textureProps.rotation,
        textureFileIndex: wallFace.connection.textureProps.fileIndex,
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

export const persistMaterialColor = (material: MeshStandardMaterial): string => {
    return "#" + material.color.getHexString();
};

