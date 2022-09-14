import {SceneObjectsState} from "../context/SceneObjectsDefaults";
import {AdjacentWallProps} from "../../drawer/components/DrawerMath";
import {
    ComponentProps,
    ComponentType,
    WallComponent
} from "../../drawer/objects/component/WallComponent";
import {ObjectSideOrientation} from "../../drawer/constants/Types";
import {PlacedWall} from "../../drawer/objects/wall/PlacedWall";
import {IMovingWallComponent} from "../../drawer/objects/component/IMovingWallComponent";
import {IPlacedWallComponent} from "../../drawer/objects/component/IPlacedWallComponent";
import {
    PersistedVector2D,
    PersistedVector3,
    PersistedWallConstruction, persistVector2D, persistWallConstruction,
    toAdjacentWallPropsList,
    toVector3,
    toWallConstruction
} from "./Mappers";
import {Direction} from "../../drawer/objects/wall/Direction";

type PersistedComponentProps = {
    thumbnail: string,
    name: string,
    width: number,
    thickness: number,
    height: number,
    elevation: number,
    mutableFields: PersistedComponentPropsMutableFields,
}

type PersistedComponentPropsMutableFields = {
    width: boolean,
    height: boolean,
    elevation: boolean,
}

export type PersistedAdjacentWallProps = {
    toSide: ObjectSideOrientation,
    points: Array<PersistedVector3>,
}

type PersistedPlacedWall = {
    props: PersistedWallConstruction,
    adjacentWallPropsList: Array<PersistedAdjacentWallProps>,
    // todo: wall side colors will be kept in another structure and applied to wall's direction in order
}

type PersistedWallComponent = {
    props: PersistedComponentProps,
    position: PersistedVector3,
    orientation: PersistedVector2D,
    type: ComponentType,
    postProcessedTextureRotation: number,
    frameColor: string,
}

type WallToComponents = {
    wall: PersistedPlacedWall,
    componentList: Array<PersistedWallComponent>,
}

export const saveFile = (sceneObjectsState: SceneObjectsState): string => {

    const wallToComponentsList = sceneObjectsState.placedWalls.map(pw => {
        const wall: PersistedPlacedWall = {
            props: persistWallConstruction(pw.props),
            adjacentWallPropsList: pw.adjacentWallPropsList.map(awp => mapAdjacentWallProps(awp)),
        };

        const componentList = pw.wallComponents.map(wc => {
            const persistedComponent: PersistedWallComponent = {
                frameColor: "#" + wc.getFrameMaterial().color.getHexString(),
                orientation: persistVector2D(wc.getOrientation()),
                position: wc.getPosition(),
                postProcessedTextureRotation: wc.getPostProcessedTextureRotation().value,
                props: mapComponentProps((wc as WallComponent).props),
                type: wc.getType(),
            };
            return persistedComponent;
        });

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

const mapAdjacentWallProps = (awp: AdjacentWallProps): PersistedAdjacentWallProps => {
    return { toSide: awp.toSide, points: awp.points };
};

const mapComponentProps = (cp: ComponentProps): PersistedComponentProps => {
    return {
        elevation: cp.elevation,
        height: cp.height,
        mutableFields: cp.mutableFields,
        name: cp.name,
        thickness: cp.thickness,
        thumbnail: cp.thumbnail,
        width: cp.width,
    };
};




export const loadData = (data: string): SceneObjectsState => {
    const deserialized: Array<WallToComponents> = JSON.parse(data);

    const placedWallsState = new Array<PlacedWall>();
    const wallComponentsState = new Array<IPlacedWallComponent>();

    for (const wallToComponent of deserialized) {
        const placedWall = PlacedWall.create(toWallConstruction(wallToComponent.wall.props),
            toAdjacentWallPropsList(wallToComponent.wall.adjacentWallPropsList));

        for (const persistedWallComponent of wallToComponent.componentList) {
            const placedWallComponent = createMovingWallComponent(persistedWallComponent)
                .createPlacedComponent(placedWall);
            placedWallComponent.changePosition(toVector3(persistedWallComponent.position));
            placedWallComponent.changeOrientation(Direction.ofStrings(persistedWallComponent.orientation));
            placedWallComponent.getPostProcessedTextureRotation().value = persistedWallComponent.postProcessedTextureRotation;
            placedWallComponent.getFrameMaterial().color.set(persistedWallComponent.frameColor);

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

const createMovingWallComponent = (persistedWallComponent: PersistedWallComponent): IMovingWallComponent => {
    switch (persistedWallComponent.type) {
        case ComponentType.DOOR:
            return WallComponent.createMovingDoor(persistedWallComponent.props);
        case ComponentType.WINDOW:
            return WallComponent.createMovingWindow(persistedWallComponent.props);
    }
};
