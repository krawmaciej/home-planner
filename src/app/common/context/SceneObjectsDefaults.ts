import {PlacedWall} from "../../drawer/objects/wall/PlacedWall";
import {IWallComponent} from "../../drawer/objects/window/IWallComponent";
import {Floor} from "../../drawer/objects/floor/Floor";

export type SceneObjectsState = {
    placedWalls: Array<PlacedWall>,
    wallComponents: Array<IWallComponent>,
    floors: Array<Floor>,
    // ceilings
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
        placedWalls: createPlacedWalls(),
        wallComponents: createWallComponents(),
        floors: createFloors(),
    } as SceneObjectsState;
};
