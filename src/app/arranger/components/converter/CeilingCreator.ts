import {FloorCeiling} from "../../../drawer/objects/floor/FloorCeiling";
import {Mesh} from "three";
import {Attributes, Coordinate, Facing} from "../../constants/Types";
import {ObjectPoint} from "../../../drawer/constants/Types";
import {AttributesToGeometry} from "./AttributesToGeometry";
import {ObjectWithEditableTexture} from "../../objects/ArrangerObject";

export class CeilingCreator {

    private readonly elevation: number;

    public constructor(elevation: number) {
        this.elevation = elevation;
    }

    public createFromFloor(floor: FloorCeiling): ObjectWithEditableTexture {
        const attributes = this.createAttributes(floor);
        const geometry = AttributesToGeometry.process(attributes);
        return {
            object3d: new Mesh(geometry, floor.ceilingMaterial),
            textureProps: floor.ceilingTextureRotation,
            initialTextureRotation: 0,
        };
    }

    private createAttributes(floor: FloorCeiling): Array<Attributes> {
        const points = floor.getObjectPointsOnScene();

        const bottomLeft = points[ObjectPoint.BOTTOM_LEFT].toArray();
        const topLeft = points[ObjectPoint.TOP_LEFT].toArray();
        const topRight = points[ObjectPoint.TOP_RIGHT].toArray();
        const bottomRight = points[ObjectPoint.BOTTOM_RIGHT].toArray();

        // elevate to ceiling level
        bottomLeft[Coordinate.Y] = this.elevation;
        topLeft[Coordinate.Y] = this.elevation;
        topRight[Coordinate.Y] = this.elevation;
        bottomRight[Coordinate.Y] = this.elevation;

        return [
            {position: bottomLeft,  normal: Facing.DOWN, uv: CeilingCreator.toUv(bottomLeft) },
            {position: topLeft,     normal: Facing.DOWN, uv: CeilingCreator.toUv(topLeft)    },
            {position: topRight,    normal: Facing.DOWN, uv: CeilingCreator.toUv(topRight)   },
            {position: topRight,    normal: Facing.DOWN, uv: CeilingCreator.toUv(topRight)   },
            {position: bottomRight, normal: Facing.DOWN, uv: CeilingCreator.toUv(bottomRight)},
            {position: bottomLeft,  normal: Facing.DOWN, uv: CeilingCreator.toUv(bottomLeft) },
        ];
    }

    private static toUv(coordinates: Array<number>) {
        if (coordinates.length !== 3) {
            throw new Error(`Malformed Vector3 with coordinates: ${coordinates} while creating ceilings.`);
        }
        return [coordinates[Coordinate.X], coordinates[Coordinate.Z]];
    }
}
