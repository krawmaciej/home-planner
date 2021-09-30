import { BufferAttribute, BufferGeometry, Material, Mesh, MeshPhongMaterial, Shape, ShapeGeometry } from "three";
import { AttributeName, AttributeNumber, Attributes, Dimensions, Facing } from "./constants/Types";
import Window from "./Window";

export default class Wall {

    public readonly dimensions: Dimensions;
    public readonly mainWallFrame: Mesh;
    public material: Material; // TODO: add setters, so every child object changes it's material with wall parent
    public readonly windows: Array<Window> = new Array<Window>();

    private readonly cacheFrontShape: Shape; // changes only on wall size change
    private frontFace: Mesh; // kept to enable removing of old wall with old holes

    private constructor(dimensions: Dimensions, wallFrame: Mesh, cacheFrontShape: Shape, frontFace: Mesh, material: Material) {
        this.dimensions = dimensions;
        this.mainWallFrame = wallFrame;
        this.cacheFrontShape = cacheFrontShape;
        this.frontFace = frontFace;
        this.material = material;
    }

    public static create(dimensions: Dimensions) {
        const material = new MeshPhongMaterial({color: 0x00ffff});
        const frameGeometry = this.createWallFrame(dimensions);
        const wallFrame = new Mesh(frameGeometry, material);
        const frontShape = this.createFrontShape(dimensions);
        const frontGeometry = this.createFace(frontShape);
        const frontFace = new Mesh(frontGeometry, material);
        wallFrame.add(frontFace);

        return new Wall(dimensions, wallFrame, frontShape, frontFace, material);
    }

    private static createWallFrame({length: l, height: h, width: w}: Dimensions) {
        const s = Math.SQRT2;

        const vertices: Array<Attributes> = [
            // bottom
            { position: [  0,   0,   0], normal: Facing.DOWN, uv: [  0,   0] },
            { position: [ -w,   0,  -w], normal: Facing.DOWN, uv: [ -w,   w] },
            { position: [w+l,   0,  -w], normal: Facing.DOWN, uv: [w+l,   w] },
            { position: [w+l,   0,  -w], normal: Facing.DOWN, uv: [w+l,   w] },
            { position: [  l,   0,   0], normal: Facing.DOWN, uv: [  l,   0] },
            { position: [  0,   0,   0], normal: Facing.DOWN, uv: [  0,   0] },

            // top
            { position: [  0,   h,   0], normal: Facing.UP, uv: [  0,   0] },
            { position: [  l,   h,   0], normal: Facing.UP, uv: [  l,   0] },
            { position: [w+l,   h,  -w], normal: Facing.UP, uv: [w+l,   w] },
            { position: [w+l,   h,  -w], normal: Facing.UP, uv: [w+l,   w] },
            { position: [ -w,   h,  -w], normal: Facing.UP, uv: [ -w,   w] },
            { position: [  0,   h,   0], normal: Facing.UP, uv: [  0,   0] },

            // left
            { position: [  0,   0,   0], normal: Facing.LEFT, uv: [  0,   0] },
            { position: [  0,   h,   0], normal: Facing.LEFT, uv: [  h,   0] },
            { position: [ -w,   h,  -w], normal: Facing.LEFT, uv: [  h, w*s] },
            { position: [ -w,   h,  -w], normal: Facing.LEFT, uv: [  h, w*s] },
            { position: [ -w,   0,  -w], normal: Facing.LEFT, uv: [  0, w*s] },
            { position: [  0,   0,   0], normal: Facing.LEFT, uv: [  0,   0] },

            // right
            { position: [  l,   0,   0], normal: Facing.RIGHT, uv: [  0,   0] },
            { position: [w+l,   0,  -w], normal: Facing.RIGHT, uv: [  0, w*s] },
            { position: [w+l,   h,  -w], normal: Facing.RIGHT, uv: [  h, w*s] },
            { position: [w+l,   h,  -w], normal: Facing.RIGHT, uv: [  h, w*s] },
            { position: [  l,   h,   0], normal: Facing.RIGHT, uv: [  h,   0] },
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

    private static createFace(shape: Shape) {
        const geometry = new ShapeGeometry(shape);
        return geometry;
    }

    private static createFrontShape({length: l, height: h}: Dimensions) {
        const shape = new Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0, h);
        shape.lineTo(l, h);
        shape.lineTo(l, 0);
        shape.lineTo(0, 0);
        return shape;
    }

    public addWindow(window: Window) {
        this.mainWallFrame.add(window.mainWindowFrame);
        this.windows.push(window);
        this.updateCutFrames();
    }

    public rotateGeometry() {
        throw new Error("Method not implemented.");
    }

    updateCutFrames() {
        const newShape = this.cacheFrontShape.clone();

        this.windows.forEach((value: Window) => {
            // take below values from box3 of windowobject3d mesh
            const x = value.mainWindowFrame.position.x;
            const y = value.mainWindowFrame.position.y;
            const l = value.windowObject.dimensions.length;
            const h = value.windowObject.dimensions.height;

            // maybe reuse createFrontShape(dimensions, positions)
            const hole = new Shape();
            // this won't be calculated using addition then
            hole.moveTo(x, y);
            hole.lineTo(x+l, y);
            hole.lineTo(x+l, y+h);
            hole.lineTo(x, y+h);
            hole.lineTo(x, y);
            newShape.holes.push(hole);
        });

        const geometry = Wall.createFace(newShape);
        const newFrontFace = new Mesh(geometry, this.material);
        this.updateFrontFace(newFrontFace);
    }

    private updateFrontFace(newFrontFace: Mesh) {
        this.mainWallFrame.remove(this.frontFace);
        this.mainWallFrame.add(newFrontFace);
        this.frontFace = newFrontFace;
    }
} 
