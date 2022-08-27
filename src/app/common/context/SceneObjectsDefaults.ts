import {PlacedWall} from "../../drawer/objects/wall/PlacedWall";
import {Floor} from "../../drawer/objects/floor/Floor";
import {DEFAULT_WALL_HEIGHT} from "../../drawer/constants/Types";
import {IPlacedWallComponent} from "../../drawer/objects/window/IPlacedWallComponent";
import {Object3D} from "three";

export type SceneObjectsState = {
    wallsHeight: number,
    placedObjects: Array<Object3D>,
    placedWalls: Array<PlacedWall>,
    wallComponents: Array<IPlacedWallComponent>,
    floors: Array<Floor>,
    // no ceilings here because they are copies of floors
}

export const createPlacedObjects = () => {
    return new Array<Object3D>();
};

export const createPlacedWalls = () => {
    return new Array<PlacedWall>();
};

export const createPlacedWallComponents = () => {
    return new Array<IPlacedWallComponent>();
};

export const createFloors = () => {
    return new Array<Floor>();
};

export const createSceneObjectsState = (): SceneObjectsState => {
    return {
        wallsHeight: DEFAULT_WALL_HEIGHT,
        placedObjects: createPlacedObjects(),
        placedWalls: createPlacedWalls(),
        wallComponents: createPlacedWallComponents(),
        floors: createFloors(),
    };
};
