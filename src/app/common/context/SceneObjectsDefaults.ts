import {PlacedWall} from "../../drawer/objects/wall/PlacedWall";
import {IWallComponent} from "../../drawer/objects/window/IWallComponent";

export type SceneObjectsState = {
    placedWalls: Array<PlacedWall>,
    wallComponents: Array<IWallComponent>,
    // floors
    // ceilings
}

export const createPlacedWalls = () => {
    return new Array<PlacedWall>();
};

export const createWallComponents = () => {
    return new Array<IWallComponent>();
};

export const createSceneObjectsState = () => {
    return {
        placedWalls: createPlacedWalls(),
        wallComponents: createWallComponents(),
    } as SceneObjectsState;
};
