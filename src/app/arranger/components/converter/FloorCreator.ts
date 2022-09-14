import {FloorCeiling} from "../../../drawer/objects/floor/FloorCeiling";
import {Mesh} from "three";
import {Attributes, Coordinate, Facing} from "../../constants/Types";
import {ObjectPoint} from "../../../drawer/constants/Types";
import {AttributesToGeometry} from "./AttributesToGeometry";
import {ObjectWithEditableTexture} from "../../objects/ArrangerObject";
import {FLOOR_INITIAL_TEXTURE_ROTATION} from "../../../common/components/TextureOperations";

export class FloorCreator {

    public createFromFloor(floor: FloorCeiling): ObjectWithEditableTexture {
        const attributes = FloorCreator.createAttributes(floor);
        const geometry = AttributesToGeometry.process(attributes);
        return {
            object3d: new Mesh(geometry, floor.floorMaterial),
            textureProps: floor.floorTextureRotation,
            initialTextureRotation: FLOOR_INITIAL_TEXTURE_ROTATION,
        };
    }

    private static createAttributes(floor: FloorCeiling): Array<Attributes> {
        const points = floor.getObjectPointsOnScene();

        const bottomLeft = points[ObjectPoint.BOTTOM_LEFT].toArray();
        const topLeft = points[ObjectPoint.TOP_LEFT].toArray();
        const topRight = points[ObjectPoint.TOP_RIGHT].toArray();
        const bottomRight = points[ObjectPoint.BOTTOM_RIGHT].toArray();

        // put on the floor level
        bottomLeft[Coordinate.Y] = 0;
        topLeft[Coordinate.Y] = 0;
        topRight[Coordinate.Y] = 0;
        bottomRight[Coordinate.Y] = 0;

        return [
            {position: bottomLeft,  normal: Facing.UP, uv: FloorCreator.toUv(bottomLeft) },
            {position: bottomRight, normal: Facing.UP, uv: FloorCreator.toUv(bottomRight)},
            {position: topRight,    normal: Facing.UP, uv: FloorCreator.toUv(topRight)   },
            {position: topRight,    normal: Facing.UP, uv: FloorCreator.toUv(topRight)   },
            {position: topLeft,     normal: Facing.UP, uv: FloorCreator.toUv(topLeft)    },
            {position: bottomLeft,  normal: Facing.UP, uv: FloorCreator.toUv(bottomLeft) },
        ];
    }

    private static toUv(coordinates: Array<number>) {
        if (coordinates.length !== 3) {
            throw new Error(`Malformed Vector3 with coordinates: ${coordinates} while creating floors.`);
        }
        return [coordinates[Coordinate.X], coordinates[Coordinate.Z]];
    }
}
