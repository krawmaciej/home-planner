import { BufferAttribute, BufferGeometry, Material, Mesh, MeshBasicMaterial, MeshDepthMaterial, MeshDistanceMaterial, MeshLambertMaterial, MeshNormalMaterial, MeshPhongMaterial, Object3D, Scene, Shape, ShapeGeometry, Vector3 } from "three";
import Window from "./Window";

type Attributes = {
    position: Array<number>,
    normal: Array<number>,
    uv: Array<number>
}

enum AttributeName {
    POSITION = "position",
    NORMAL = "normal",
    UV = "uv",
}

enum AttributeNumber {
    POSITION = 3,
    NORMAL = 3,
    UV = 2,
}

class Facing {
    public static readonly RIGHT = [1, 0, 0];
    public static readonly UP = [0, 1, 0];
    public static readonly FRONT = [0, 0, 1];
    public static readonly LEFT = [-1, 0, 0];
    public static readonly DOWN = [0, -1, 0];
    public static readonly BACK = [0, 0, -1];
}

export type WallDimensions = {
    length: number,
    height: number,
    thickness: number
}

export default class Wall {
    private readonly dimensions: WallDimensions;
    public readonly wallFrame: Mesh;
    private front: Mesh;
    private material: Material;
    public readonly windows: Array<Window> = new Array<Window>();

    private constructor(dimensions: WallDimensions, wallFrame: Mesh, front: Mesh, material: Material) {
        this.dimensions = dimensions;
        this.wallFrame = wallFrame;
        this.material = material;
        this.front = front;
    }

    public static create(dimensions: WallDimensions) {
        const material = new MeshPhongMaterial({color: 0x00ffff});
        const frameGeometry = this.createWallFrame(dimensions);
        const wallFrame = new Mesh(frameGeometry, material);
        const frontGeometry = this.createFace(dimensions);
        const front = new Mesh(frontGeometry, material);
        wallFrame.add(front);

        return new Wall(dimensions, wallFrame, front, material);
    }

    private static createWallFrame({length: l, height: h, thickness: t}: WallDimensions) {
        const s = Math.SQRT2;

        const vertices: Array<Attributes> = [
            // bottom
            { position: [  0,   0,   0], normal: Facing.DOWN, uv: [  0,   0] },
            { position: [ -t,   0,  -t], normal: Facing.DOWN, uv: [ -t,   t] },
            { position: [t+l,   0,  -t], normal: Facing.DOWN, uv: [t+l,   t] },
            { position: [t+l,   0,  -t], normal: Facing.DOWN, uv: [t+l,   t] },
            { position: [  l,   0,   0], normal: Facing.DOWN, uv: [  l,   0] },
            { position: [  0,   0,   0], normal: Facing.DOWN, uv: [  0,   0] },

            // top
            { position: [  0,   h,   0], normal: Facing.UP, uv: [  0,   0] },
            { position: [  l,   h,   0], normal: Facing.UP, uv: [  l,   0] },
            { position: [t+l,   h,  -t], normal: Facing.UP, uv: [t+l,   t] },
            { position: [t+l,   h,  -t], normal: Facing.UP, uv: [t+l,   t] },
            { position: [ -t,   h,  -t], normal: Facing.UP, uv: [ -t,   t] },
            { position: [  0,   h,   0], normal: Facing.UP, uv: [  0,   0] },

            // left
            { position: [  0,   0,   0], normal: Facing.LEFT, uv: [  0,   0] },
            { position: [  0,   h,   0], normal: Facing.LEFT, uv: [  l,   0] },
            { position: [ -t,   h,  -t], normal: Facing.LEFT, uv: [  l, t*s] },
            { position: [ -t,   h,  -t], normal: Facing.LEFT, uv: [  l, t*s] },
            { position: [ -t,   0,  -t], normal: Facing.LEFT, uv: [  0, t*s] },
            { position: [  0,   0,   0], normal: Facing.LEFT, uv: [  0,   0] },

            // right
            { position: [  l,   0,   0], normal: Facing.RIGHT, uv: [  0,   0] },
            { position: [t+l,   0,  -t], normal: Facing.RIGHT, uv: [  0, t*s] },
            { position: [t+l,   h,  -t], normal: Facing.RIGHT, uv: [  l, t*s] },
            { position: [t+l,   h,  -t], normal: Facing.RIGHT, uv: [  l, t*s] },
            { position: [  l,   h,   0], normal: Facing.RIGHT, uv: [  l,   0] },
            { position: [  l,   0,   0], normal: Facing.RIGHT, uv: [  0,   0] },
        ];

        const positions = [];
        const normals = [];
        const uvs = [];
        for (const vertex of vertices) {
            positions.push(...vertex.position);
            normals.push(...vertex.normal);
            uvs.push(...vertex.uv);
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute(AttributeName.POSITION, new BufferAttribute(new Float32Array(positions), AttributeNumber.POSITION));
        geometry.setAttribute(AttributeName.NORMAL, new BufferAttribute(new Float32Array(normals), AttributeNumber.NORMAL));
        geometry.setAttribute(AttributeName.UV, new BufferAttribute(new Float32Array(uvs), AttributeNumber.UV));

        return geometry;
    }

    private static createFace(dimensions: WallDimensions) {
        const shape = this.createFaceFront(dimensions);
        const geometry = new ShapeGeometry(shape);
        return geometry;
    }

    private static createFaceFront({length: l, height: h}: WallDimensions) {
        const shape = new Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0, h);
        shape.lineTo(l, h);
        shape.lineTo(l, 0);
        shape.lineTo(0, 0);
        return shape;
    }

    private static createFaceBack({length: l, height: h}: WallDimensions) {
        const shape = new Shape();
        shape.moveTo(0, 0);
        shape.lineTo(l, 0);
        shape.lineTo(l, h);
        shape.lineTo(0, h);
        shape.lineTo(0, 0);
        return shape;
    }

    private createRectangleFace(bottomLeft: number, topRight: number, facing: Facing) {
        return [
            {}
        ];
    }

    private createWallMesh(): Mesh {
        return new Mesh();
    }

    public rotateGeometry() {

    }

    updateCutFrames() {
        this.windows.forEach((value: Window) => {
            //
        });
        throw new Error("Method not implemented.");
    }
} 
