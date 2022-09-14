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
    PersistedPlacedWall, PersistedWallComponent, persistPlacedWall, persistWallComponent,
    toAdjacentWallPropsList, toComponentProps,
    toVector3,
    toWallConstruction
} from "./Mappers";
import {Direction} from "../../drawer/objects/wall/Direction";
import {ObjectProps} from "../../arranger/objects/ImportedObject";
import {LoadedTexture} from "../models/TextureDefinition";
import {
    COMPONENT_FRAME_INITIAL_TEXTURE_ROTATION,
    getWallFaceTextureRotation,
    setTexture
} from "../components/TextureOperations";

type WallToComponents = {
    wall: PersistedPlacedWall,
    componentList: Array<PersistedWallComponent>,
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

    return JSON.stringify(wallToComponentsList); //todo: might cause errors with thumbnail urls
};

// eslint-disable-next-line unused-imports/no-unused-vars
class IdProvider {
    private id = 0;

    public nextId(): number {
        return this.id++;
    }
}

export const loadData = (
    data: string,
    doorDefinitions: Array<ComponentProps>,
    windowDefinitions: Array<ComponentProps>,
    objectDefinitions: Array<ObjectProps>,
    texturePromises: Array<LoadedTexture>
): SceneObjectsState => {
    const deserialized: Array<WallToComponents> = JSON.parse(data);

    const placedWallsState = new Array<PlacedWall>();
    const wallComponentsState = new Array<IPlacedWallComponent>();

    for (const wallToComponent of deserialized) {
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
                    throw new Error(`Selected texture index: ${persistedWallComponent.textureFileIndex} 
                            not found in textures ${JSON.stringify(texturePromises)}`);
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

    return {
        floors: [],
        placedObjects: [],
        placedWalls: placedWallsState,
        wallComponents: wallComponentsState,
        wallHeight: undefined,
    };
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
