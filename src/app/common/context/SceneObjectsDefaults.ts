import {PlacedWall} from "../../drawer/objects/wall/PlacedWall";
import {FloorCeiling} from "../../drawer/objects/floor/FloorCeiling";
import {DEFAULT_WALL_HEIGHT} from "../../drawer/constants/Types";
import {IPlacedWallComponent} from "../../drawer/objects/component/IPlacedWallComponent";
import {ObjectProps} from "../../arranger/objects/ImportedObject";

export type SceneObjectsState = {
    wallsHeight: number,
    placedObjects: Array<ObjectProps>,
    placedWalls: Array<PlacedWall>,
    wallComponents: Array<IPlacedWallComponent>,
    floors: Array<FloorCeiling>,
    // no ceilings here because they are copies of floors
}

export const createPlacedObjects = () => {
    return new Array<ObjectProps>();
};

export const createPlacedWalls = () => {
    return new Array<PlacedWall>();
};

export const createPlacedWallComponents = () => {
    return new Array<IPlacedWallComponent>();
};

export const createFloors = () => {
    return new Array<FloorCeiling>();
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
