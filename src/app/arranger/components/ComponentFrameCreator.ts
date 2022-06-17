import {ObjectPoint} from "../../drawer/constants/Types";
import { Attributes, Coordinate, Facing} from "../constants/Types";
import {
    Mesh,
    MeshBasicMaterialParameters,
    MeshStandardMaterial,
    Vector3
} from "three";
import {instanceOfUvTxt} from "./Textures";
import {IWallComponent} from "../../drawer/objects/window/IWallComponent";
import {Direction} from "../../drawer/objects/wall/Direction";
import {AttributesToGeometry} from "./AttributesToGeometry";

export class ComponentFrameCreator {

    private readonly frameMaterial: MeshStandardMaterial;

    public constructor(frameMaterial: MeshStandardMaterial) {
        this.frameMaterial = frameMaterial;
    }

    public createFromWallComponent(wallComponent: IWallComponent) {
        const attributes = ComponentFrameCreator.createAttributes(wallComponent);
        const geometry = AttributesToGeometry.process(attributes);

        instanceOfUvTxt().then(txt => {
            txt.repeat.set(0.1, 0.1);
            this.frameMaterial.setValues({
                map: txt,
                color: 0x888888,
            } as MeshBasicMaterialParameters);
        });
        return new Mesh(geometry, this.frameMaterial);
    }

    private static elevate(coordinates: Vector3, elevation: number) {
        const array = coordinates.toArray();
        array[Coordinate.Y] = elevation;
        return array;
    }

    private static withHeight(coordinates: number[], height: number) {
        if (coordinates.length !== 3) {
            throw new Error(`Invalid Vector3 coordinates: ${coordinates} when creating component frame.`);
        }
        const result = [...coordinates];
        result[Coordinate.Y] += height;
        return result;
    }

    private static createAttributes(wallComponent: IWallComponent): Array<Attributes> {
        const points = wallComponent.getObjectPointsOnScene();
        const elevation = wallComponent.getElevation();
        const height = wallComponent.getHeight();
        const direction = wallComponent.getDirection();

        // bottom points
        const bottomLeft = ComponentFrameCreator.elevate(points[ObjectPoint.BOTTOM_LEFT], elevation);
        const topLeft = ComponentFrameCreator.elevate(points[ObjectPoint.TOP_LEFT], elevation);
        const topRight = ComponentFrameCreator.elevate(points[ObjectPoint.TOP_RIGHT], elevation);
        const bottomRight = ComponentFrameCreator.elevate(points[ObjectPoint.BOTTOM_RIGHT], elevation);
        // top points
        const bottomLeftWithHeight = ComponentFrameCreator.withHeight(bottomLeft, height);
        const topLeftWithHeight = ComponentFrameCreator.withHeight(topLeft, height);
        const topRightWithHeight = ComponentFrameCreator.withHeight(topRight, height);
        const bottomRightWithHeight = ComponentFrameCreator.withHeight(bottomRight, height);

        if (direction === Direction.LEFT || direction === Direction.RIGHT) {
            return [
                // bottom
                { position: bottomLeft,  normal: Facing.UP, uv: [bottomLeft[Coordinate.X],  bottomLeft[Coordinate.Z]]  },
                { position: bottomRight, normal: Facing.UP, uv: [bottomRight[Coordinate.X], bottomRight[Coordinate.Z]] },
                { position: topRight,    normal: Facing.UP, uv: [topRight[Coordinate.X],    topRight[Coordinate.Z]]    },
                { position: topRight,    normal: Facing.UP, uv: [topRight[Coordinate.X],    topRight[Coordinate.Z]]    },
                { position: topLeft,     normal: Facing.UP, uv: [topLeft[Coordinate.X],     topLeft[Coordinate.Z]]     },
                { position: bottomLeft,  normal: Facing.UP, uv: [bottomLeft[Coordinate.X],  bottomLeft[Coordinate.Z]]  },

                // top
                { position: bottomLeftWithHeight,  normal: Facing.DOWN, uv: [bottomLeftWithHeight[Coordinate.X],  bottomLeftWithHeight[Coordinate.Z]]  },
                { position: topLeftWithHeight,     normal: Facing.DOWN, uv: [topLeftWithHeight[Coordinate.X],     topLeftWithHeight[Coordinate.Z]]     },
                { position: topRightWithHeight,    normal: Facing.DOWN, uv: [topRightWithHeight[Coordinate.X],    topRightWithHeight[Coordinate.Z]]    },
                { position: topRightWithHeight,    normal: Facing.DOWN, uv: [topRightWithHeight[Coordinate.X],    topRightWithHeight[Coordinate.Z]]    },
                { position: bottomRightWithHeight, normal: Facing.DOWN, uv: [bottomRightWithHeight[Coordinate.X], bottomRightWithHeight[Coordinate.Z]] },
                { position: bottomLeftWithHeight,  normal: Facing.DOWN, uv: [bottomLeftWithHeight[Coordinate.X],  bottomLeftWithHeight[Coordinate.Z]]  },

                // left
                { position: bottomLeft,           normal: Facing.RIGHT, uv: [bottomLeft[Coordinate.Z],           bottomLeft[Coordinate.Y]]           },
                { position: topLeft,              normal: Facing.RIGHT, uv: [topLeft[Coordinate.Z],              topLeft[Coordinate.Y]]              },
                { position: topLeftWithHeight,    normal: Facing.RIGHT, uv: [topLeftWithHeight[Coordinate.Z],    topLeftWithHeight[Coordinate.Y]]    },
                { position: topLeftWithHeight,    normal: Facing.RIGHT, uv: [topLeftWithHeight[Coordinate.Z],    topLeftWithHeight[Coordinate.Y]]    },
                { position: bottomLeftWithHeight, normal: Facing.RIGHT, uv: [bottomLeftWithHeight[Coordinate.Z], bottomLeftWithHeight[Coordinate.Y]] },
                { position: bottomLeft,           normal: Facing.RIGHT, uv: [bottomLeft[Coordinate.Z],           bottomLeft[Coordinate.Y]]           },

                // right
                { position: bottomRight,           normal: Facing.LEFT, uv: [bottomRight[Coordinate.Z],           bottomRight[Coordinate.Y]]           },
                { position: bottomRightWithHeight, normal: Facing.LEFT, uv: [bottomRightWithHeight[Coordinate.Z], bottomRightWithHeight[Coordinate.Y]] },
                { position: topRightWithHeight,    normal: Facing.LEFT, uv: [topRightWithHeight[Coordinate.Z],    topRightWithHeight[Coordinate.Y]]    },
                { position: topRightWithHeight,    normal: Facing.LEFT, uv: [topRightWithHeight[Coordinate.Z],    topRightWithHeight[Coordinate.Y]]    },
                { position: topRight,              normal: Facing.LEFT, uv: [topRight[Coordinate.Z],              topRight[Coordinate.Y]]              },
                { position: bottomRight,           normal: Facing.LEFT, uv: [bottomRight[Coordinate.Z],           bottomRight[Coordinate.Y]]           },
            ];
        } else {
            return [
                // bottom
                { position: bottomLeft,  normal: Facing.UP, uv: [bottomLeft[Coordinate.Z],  bottomLeft[Coordinate.X]]  },
                { position: bottomRight, normal: Facing.UP, uv: [bottomRight[Coordinate.Z], bottomRight[Coordinate.X]] },
                { position: topRight,    normal: Facing.UP, uv: [topRight[Coordinate.Z],    topRight[Coordinate.X]]    },
                { position: topRight,    normal: Facing.UP, uv: [topRight[Coordinate.Z],    topRight[Coordinate.X]]    },
                { position: topLeft,     normal: Facing.UP, uv: [topLeft[Coordinate.Z],     topLeft[Coordinate.X]]     },
                { position: bottomLeft,  normal: Facing.UP, uv: [bottomLeft[Coordinate.Z],  bottomLeft[Coordinate.X]]  },

                // top
                { position: bottomLeftWithHeight,  normal: Facing.DOWN, uv: [bottomLeftWithHeight[Coordinate.Z],  bottomLeftWithHeight[Coordinate.X]]  },
                { position: topLeftWithHeight,     normal: Facing.DOWN, uv: [topLeftWithHeight[Coordinate.Z],     topLeftWithHeight[Coordinate.X]]     },
                { position: topRightWithHeight,    normal: Facing.DOWN, uv: [topRightWithHeight[Coordinate.Z],    topRightWithHeight[Coordinate.X]]    },
                { position: topRightWithHeight,    normal: Facing.DOWN, uv: [topRightWithHeight[Coordinate.Z],    topRightWithHeight[Coordinate.X]]    },
                { position: bottomRightWithHeight, normal: Facing.DOWN, uv: [bottomRightWithHeight[Coordinate.Z], bottomRightWithHeight[Coordinate.X]] },
                { position: bottomLeftWithHeight,  normal: Facing.DOWN, uv: [bottomLeftWithHeight[Coordinate.Z],  bottomLeftWithHeight[Coordinate.X]]  },

                // front (world-orientation-wise)
                { position: bottomLeft,            normal: Facing.BACK, uv: [bottomLeft[Coordinate.X],            bottomLeft[Coordinate.Y]]            },
                { position: bottomLeftWithHeight,  normal: Facing.BACK, uv: [bottomLeftWithHeight[Coordinate.X],  bottomLeftWithHeight[Coordinate.Y]]  },
                { position: bottomRightWithHeight, normal: Facing.BACK, uv: [bottomRightWithHeight[Coordinate.X], bottomRightWithHeight[Coordinate.Y]] },
                { position: bottomRightWithHeight, normal: Facing.BACK, uv: [bottomRightWithHeight[Coordinate.X], bottomRightWithHeight[Coordinate.Y]] },
                { position: bottomRight,           normal: Facing.BACK, uv: [bottomRight[Coordinate.X],           bottomRight[Coordinate.Y]]           },
                { position: bottomLeft,            normal: Facing.BACK, uv: [bottomLeft[Coordinate.X],            bottomLeft[Coordinate.Y]]            },

                // back (world-orientation-wise)
                { position: topLeft,            normal: Facing.FRONT, uv: [topLeft[Coordinate.X],            topLeft[Coordinate.Y]]            },
                { position: topRight,           normal: Facing.FRONT, uv: [topRight[Coordinate.X],           topRight[Coordinate.Y]]           },
                { position: topRightWithHeight, normal: Facing.FRONT, uv: [topRightWithHeight[Coordinate.X], topRightWithHeight[Coordinate.Y]] },
                { position: topRightWithHeight, normal: Facing.FRONT, uv: [topRightWithHeight[Coordinate.X], topRightWithHeight[Coordinate.Y]] },
                { position: topLeftWithHeight,  normal: Facing.FRONT, uv: [topLeftWithHeight[Coordinate.X],  topLeftWithHeight[Coordinate.Y]]  },
                { position: topLeft,            normal: Facing.FRONT, uv: [topLeft[Coordinate.X],            topLeft[Coordinate.Y]]            },
            ];
        }
    }
}
