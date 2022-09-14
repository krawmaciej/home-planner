import {AdjacentWallProps, WallConstruction} from "../../drawer/components/DrawerMath";
import {Vector3} from "three";
import {PersistedAdjacentWallProps} from "./Persistance";
import {Direction} from "../../drawer/objects/wall/Direction";
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

export const toVector3 = (persisted: PersistedVector3): Vector3 => {
    return new Vector3(persisted.x, persisted.y, persisted.z);
};

export const persistVector2D = (vector2d: Vector2D): PersistedVector2D => {
    return {
        x: vector2d.x.toString(),
        z: vector2d.z.toString(),
    };
};

export const persistWallConstruction = (wallConstruction: WallConstruction): PersistedWallConstruction => {
    return {
        direction: persistVector2D(wallConstruction.direction),
        middlePoints: wallConstruction.middlePoints,
        points: wallConstruction.points,
        width: wallConstruction.width,
    };
};

