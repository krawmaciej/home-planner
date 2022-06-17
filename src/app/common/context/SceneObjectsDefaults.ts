import {PlacedWall} from "../../drawer/objects/wall/PlacedWall";
import {IWallComponent} from "../../drawer/objects/window/IWallComponent";
import {Floor} from "../../drawer/objects/floor/Floor";
import {DEFAULT_WALL_HEIGHT} from "../../drawer/constants/Types";

export type SceneObjectsState = {
    wallsHeight: number,
    placedWalls: Array<PlacedWall>,
    wallComponents: Array<IWallComponent>,
    floors: Array<Floor>,
    // no ceilings here because they are copies of floors
}

export const createPlacedWalls = () => {
    return new Array<PlacedWall>();
};

export const createWallComponents = () => {
    return new Array<IWallComponent>();
};

export const createFloors = () => {
    return new Array<Floor>();
};

export const createSceneObjectsState = () => {
    return {
        wallsHeight: DEFAULT_WALL_HEIGHT,
        placedWalls: createPlacedWalls(),
        wallComponents: createWallComponents(),
        floors: createFloors(),
    } as SceneObjectsState;
};
