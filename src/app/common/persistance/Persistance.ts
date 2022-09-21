import {SceneObjectsState} from "../context/SceneObjectsDefaults";
import {
    ComponentProps,
    ComponentType,
    WallComponent
} from "../../drawer/objects/component/WallComponent";
import {PlacedWall} from "../../drawer/objects/wall/PlacedWall";
import {IMovingWallComponent} from "../../drawer/objects/component/IMovingWallComponent";
import {IPlacedWallComponent} from "../../drawer/objects/component/IPlacedWallComponent";
import {
    PersistedPlacedWall, persistPlacedWall,
    toAdjacentWallPropsList,
    toWallConstruction
} from "./WallMappers";
import {Direction} from "../../drawer/objects/wall/Direction";
import {ObjectProps} from "../../arranger/objects/ImportedObject";
import {LoadedTexture} from "../models/TextureDefinition";
import {
    COMPONENT_FRAME_INITIAL_TEXTURE_ROTATION, FLOOR_INITIAL_TEXTURE_ROTATION,
    getWallFaceTextureRotation,
    setTexture
} from "../components/TextureOperations";
import {PersistedWallComponent, persistWallComponent, toComponentProps} from "./WallComponentMappers";
import {toVector3} from "./CommonMappers";
import {PersistedFloorCeiling, persistFloorCeiling, toFloorCeilingProps} from "./FloorCeilingMappers";
import {FloorCeiling} from "../../drawer/objects/floor/FloorCeiling";
import {PersistedObjectProps, persistObjectProps, toObjectProps} from "./ObjectMappers";

type WallToComponents = {
    wall: PersistedPlacedWall,
    componentList: Array<PersistedWallComponent>,
}

type PersistedSceneObjectsState = {
    wallHeight: number | undefined,
    wallToComponentsList: Array<WallToComponents>,
    floorList: Array<PersistedFloorCeiling>,
    objectList: Array<PersistedObjectProps>,
}

export const saveFile = (sceneObjectsState: SceneObjectsState): string => {

    const wallToComponentsList = sceneObjectsState.placedWalls.map(pw => {
        const wall: PersistedPlacedWall = persistPlacedWall(pw);
        const componentList = pw.wallComponents.map(wc => persistWallComponent(wc));
        const wallToComponents: WallToComponents = {
            wall,
            componentList,
        };
        return wallToComponents;
    });

    const floorList = sceneObjectsState.floors.map(f => persistFloorCeiling(f));

    const objectList = sceneObjectsState.placedObjects.map(po => persistObjectProps(po));

    const persistedSceneObjectsState: PersistedSceneObjectsState = {
        wallHeight: sceneObjectsState.wallHeight,
        wallToComponentsList,
        floorList,
        objectList,
    };
    return JSON.stringify(persistedSceneObjectsState);
};

export const loadData = (
    data: string,
    doorDefinitions: Array<ComponentProps>,
    windowDefinitions: Array<ComponentProps>,
    objectDefinitions: Array<ObjectProps>,
    texturePromises: Array<LoadedTexture>,
): SceneObjectsState => {
    const deserialized: PersistedSceneObjectsState = JSON.parse(data);

    const { placedWallsState, wallComponentsState } = deserializeWallsAndWallComponents(
        deserialized.wallToComponentsList,
        doorDefinitions,
        windowDefinitions,
        texturePromises
    );

    const floorsState = deserializeFloorsAndCeilings(deserialized.floorList, texturePromises);

    const placedObjectsState = deserialized.objectList.map(o => toObjectProps(o, objectDefinitions));

    return {
        floors: floorsState,
        placedObjects: placedObjectsState,
        placedWalls: placedWallsState,
        wallComponents: wallComponentsState,
        wallHeight: deserialized.wallHeight,
    };
};

const deserializeWallsAndWallComponents = (
    wallToComponentsList: Array<WallToComponents>,
    doorDefinitions: Array<ComponentProps>,
    windowDefinitions: Array<ComponentProps>,
    texturePromises: Array<LoadedTexture>,
) => {
    const placedWallsState = new Array<PlacedWall>();
    const wallComponentsState = new Array<IPlacedWallComponent>();

    for (const wallToComponent of wallToComponentsList) {
        const placedWall = PlacedWall.create(toWallConstruction(wallToComponent.wall.props),
            toAdjacentWallPropsList(wallToComponent.wall.adjacentWallPropsList));

        const wallSides = placedWall.wallSides.getWallSides();
        if (wallSides.length !== wallToComponent.wall.wallSides.length) {
            throw new Error("Cannot load wall sides - malformed file.");
        }
        for (let i = 0; i < wallSides.length; i++) {
            const wallFaces = wallSides[i].wallFaceArray();
            if (wallFaces.length !== wallToComponent.wall.wallSides[i].length) {
                throw new Error("Cannot load wall faces - malformed file.");
            }

            for (let j = 0; j < wallFaces.length; j++) {
                const restoredRotation = wallToComponent.wall.wallSides[i][j].textureRotation;
                wallFaces[j].connection.textureProps.rotation = restoredRotation;

                const restoredTexture = wallToComponent.wall.wallSides[i][j].textureFileIndex;
                wallFaces[j].connection.textureProps.fileIndex = restoredTexture;

                const restoredColor = wallToComponent.wall.wallSides[i][j].color;
                wallFaces[j].connection.material.color.set(restoredColor);

                if (restoredTexture !== undefined) {
                    const texture = texturePromises.at(restoredTexture);
                    if (texture === undefined) {
                        throw new Error(`Selected texture index: ${restoredTexture} 
                            not found in textures ${JSON.stringify(texturePromises)}`);
                    }
                    const initialRotation = getWallFaceTextureRotation(i);
                    setTexture(texture, wallFaces[j].connection.material, initialRotation, restoredRotation);
                }
            }
        }

        for (const persistedWallComponent of wallToComponent.componentList) {
            const placedWallComponent = createMovingWallComponent(persistedWallComponent, doorDefinitions, windowDefinitions)
                .createPlacedComponent(placedWall);
            placedWallComponent.changePosition(toVector3(persistedWallComponent.position));
            placedWallComponent.changeOrientation(Direction.ofStrings(persistedWallComponent.orientation));
            placedWallComponent.getTextureProps().rotation = persistedWallComponent.textureRotation;
            placedWallComponent.getTextureProps().fileIndex = persistedWallComponent.textureFileIndex;
            placedWallComponent.getFrameMaterial().color.set(persistedWallComponent.frameColor);
            if (persistedWallComponent.textureFileIndex !== undefined) {
                const texture = texturePromises.at(persistedWallComponent.textureFileIndex);
                if (texture === undefined) {
                    throw new Error(`Selected texture index in: ${JSON.stringify(persistedWallComponent)} not found in textures.`);
                }
                setTexture(
                    texture,
                    placedWallComponent.getFrameMaterial(),
                    COMPONENT_FRAME_INITIAL_TEXTURE_ROTATION,
                    persistedWallComponent.textureRotation,
                );
            }

            placedWall.addComponent(placedWallComponent);
            wallComponentsState.push(placedWallComponent);
        }

        placedWallsState.push(placedWall);
    }

    return { placedWallsState, wallComponentsState };
};

const deserializeFloorsAndCeilings = (floorList: Array<PersistedFloorCeiling>, texturePromises: Array<LoadedTexture>) => {
    return floorList.map(f => {
        const floorCeiling = new FloorCeiling(toFloorCeilingProps(f.props));

        floorCeiling.floorTextureProps.fileIndex = f.floorTextureFileIndex;
        floorCeiling.floorTextureProps.rotation = f.floorTextureRotation;
        floorCeiling.floorMaterial.color.set(f.floorColor);
        if (f.floorTextureFileIndex !== undefined) {
            const texture = texturePromises.at(f.floorTextureFileIndex);
            if (texture === undefined) {
                throw new Error(`Selected texture index in: ${JSON.stringify(f)} not found in textures.`);
            }
            setTexture(
                texture,
                floorCeiling.floorMaterial,
                FLOOR_INITIAL_TEXTURE_ROTATION,
                f.floorTextureRotation,
            );
        }

        floorCeiling.ceilingTextureProps.fileIndex = f.ceilingTextureFileIndex;
        floorCeiling.ceilingTextureProps.rotation = f.ceilingTextureRotation;
        floorCeiling.ceilingMaterial.color.set(f.ceilingColor);
        if (f.ceilingTextureFileIndex !== undefined) {
            const texture = texturePromises.at(f.ceilingTextureFileIndex);
            if (texture === undefined) {
                throw new Error(`Selected texture index in: ${JSON.stringify(f)} not found in textures.`);
            }
            setTexture(
                texture,
                floorCeiling.ceilingMaterial,
                FLOOR_INITIAL_TEXTURE_ROTATION,
                f.ceilingTextureRotation,
            );
        }

        return floorCeiling;
    });
};

const createMovingWallComponent = (
    persistedWallComponent: PersistedWallComponent,
    doorDefinitions: Array<ComponentProps>,
    windowDefinitions: Array<ComponentProps>,
): IMovingWallComponent => {
    switch (persistedWallComponent.type) {
        case ComponentType.DOOR:
            return WallComponent.createMovingDoor(toComponentProps(persistedWallComponent.props, doorDefinitions));
        case ComponentType.WINDOW:
            return WallComponent.createMovingWindow(toComponentProps(persistedWallComponent.props, windowDefinitions));
    }
};
