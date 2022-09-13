import {BufferGeometry, FrontSide, Mesh, MeshStandardMaterial} from "three";
import {DEFAULT_WALL_MATERIAL, ObjectPoint, ObjectPoints} from "../../../drawer/constants/Types";
import {Attributes, Coordinate, Facing} from "../../constants/Types";
import {AttributesToGeometry} from "./AttributesToGeometry";

export class WallCoversCreator {

    private static readonly ERROR_MESSAGE = (coordinates: number[]) => `Malformed Vector3 with coordinates: ${coordinates} while creating wall covers.`;
    private static readonly MATERIAL = WallCoversCreator.createMaterial();

    private static createMaterial() {
        const meshStandardMaterial = DEFAULT_WALL_MATERIAL.clone();
        meshStandardMaterial.side = FrontSide;
        return meshStandardMaterial;
    }

    public fromObjectPoints(points: ObjectPoints, wallHeight: number): Mesh<BufferGeometry, MeshStandardMaterial> {
        const attributes = WallCoversCreator.createAttributes(points, wallHeight);
        const geometry = AttributesToGeometry.process(attributes);
        return new Mesh(geometry, WallCoversCreator.MATERIAL);
    }

    private static createAttributes(points: ObjectPoints, height: number): Array<Attributes> {
        // bottom cover
        const bottomLeft = points[ObjectPoint.BOTTOM_LEFT].toArray();
        const topLeft = points[ObjectPoint.TOP_LEFT].toArray();
        const topRight = points[ObjectPoint.TOP_RIGHT].toArray();
        const bottomRight = points[ObjectPoint.BOTTOM_RIGHT].toArray();

        // top cover
        const bottomLeftWithHeight = WallCoversCreator.withHeight(bottomLeft, height);
        const topLeftWithHeight = WallCoversCreator.withHeight(topLeft, height);
        const topRightWithHeight = WallCoversCreator.withHeight(topRight, height);
        const bottomRightWithHeight = WallCoversCreator.withHeight(bottomRight, height);

        return [
            // bottom cover
            { position: bottomLeft,  normal: Facing.DOWN, uv: WallCoversCreator.toUv(bottomLeft)  },
            { position: topLeft,     normal: Facing.DOWN, uv: WallCoversCreator.toUv(topLeft)     },
            { position: topRight,    normal: Facing.DOWN, uv: WallCoversCreator.toUv(topRight)    },
            { position: topRight,    normal: Facing.DOWN, uv: WallCoversCreator.toUv(topRight)    },
            { position: bottomRight, normal: Facing.DOWN, uv: WallCoversCreator.toUv(bottomRight) },
            { position: bottomLeft,  normal: Facing.DOWN, uv: WallCoversCreator.toUv(bottomLeft)  },

            // top cover
            { position: bottomLeftWithHeight,  normal: Facing.UP, uv: WallCoversCreator.toUv(bottomLeft)  },
            { position: bottomRightWithHeight, normal: Facing.UP, uv: WallCoversCreator.toUv(bottomRight) },
            { position: topRightWithHeight,    normal: Facing.UP, uv: WallCoversCreator.toUv(topRight)    },
            { position: topRightWithHeight,    normal: Facing.UP, uv: WallCoversCreator.toUv(topRight)    },
            { position: topLeftWithHeight,     normal: Facing.UP, uv: WallCoversCreator.toUv(topLeft)     },
            { position: bottomLeftWithHeight,  normal: Facing.UP, uv: WallCoversCreator.toUv(bottomLeft)  },
        ];
    }

    private static toUv(coordinates: Array<number>) {
        if (coordinates.length !== 3) {
            throw new Error(WallCoversCreator.ERROR_MESSAGE(coordinates));
        }
        return [coordinates[Coordinate.X], coordinates[Coordinate.Z]];
    }

    private static withHeight(coordinates: number[], height: number) {
        if (coordinates.length !== 3) {
            throw new Error(WallCoversCreator.ERROR_MESSAGE(coordinates));
        }
        const result = [...coordinates];
        result[Coordinate.Y] += height;
        return result;
    }
}
