import {AdjacentWallProps, WallConstruction} from "../../drawer/components/DrawerMath";
import {Direction} from "../../drawer/objects/wall/Direction";
import {ObjectSideOrientation} from "../../drawer/constants/Types";
import {PlacedWall} from "../../drawer/objects/wall/PlacedWall";
import {WallFace} from "../../drawer/objects/wall/WallSide";
import {PersistedVector2D, PersistedVector3, persistMaterialColor, persistVector2D, toVector3} from "./CommonMappers";

export type PersistedAdjacentWallProps = {
    toSide: ObjectSideOrientation,
    points: Array<PersistedVector3>,
}

export type PersistedPlacedWall = {
    props: PersistedWallConstruction,
    adjacentWallPropsList: Array<PersistedAdjacentWallProps>,
    wallSides: Array<PersistedWallSide>,
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
