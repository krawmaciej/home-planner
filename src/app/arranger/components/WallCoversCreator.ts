import {BufferAttribute, BufferGeometry, Mesh, MeshStandardMaterial} from "three";
import {ObjectPoint, ObjectPoints} from "../../drawer/constants/Types";
import {AttributeName, AttributeNumber, Attributes, Coordinate, Facing} from "../constants/Types";
import {WallConstruction} from "../../drawer/components/DrawerMath";

export class WallCoversCreator {

    private static readonly ERROR_MESSAGE = (coordinates: number[]) => `Malformed Vector3 with coordinates: ${coordinates} while creating wall covers.`;

    private coverMeshMaterial: MeshStandardMaterial;

    constructor(coverMeshMaterial: MeshStandardMaterial) {
        this.coverMeshMaterial = coverMeshMaterial;
    }

    public fromObjectPoints({ points, height }: WallConstruction): Mesh<BufferGeometry, MeshStandardMaterial> {
        const attributes = WallCoversCreator.createAttributes(points, height);

        const positions = [];
        const normals = [];
        const uvs = [];
        for (const attribute of attributes) {
            positions.push(...attribute.position);
            normals.push(...attribute.normal);
            uvs.push(...attribute.uv);
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute(AttributeName.POSITION, new BufferAttribute(new Float32Array(positions), AttributeNumber.POSITION));
        geometry.setAttribute(AttributeName.NORMAL, new BufferAttribute(new Float32Array(normals), AttributeNumber.NORMAL));
        geometry.setAttribute(AttributeName.UV, new BufferAttribute(new Float32Array(uvs), AttributeNumber.UV));

        return new Mesh(geometry, this.coverMeshMaterial);
    }

    private static createAttributes(points: ObjectPoints, height: number) {
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

        const attributes: Array<Attributes> = [
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
        return attributes;
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
