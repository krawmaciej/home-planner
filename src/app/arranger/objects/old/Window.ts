import { BufferAttribute, BufferGeometry, Mesh } from "three";
import { AttributeName, AttributeNumber, Attributes, Dimensions, Facing, Position2D } from "../../constants/Types";
import { ImportedObject, ObjectFactory } from "../ImportedObject";
import { Wall } from "./Wall";

export class Window {

    public readonly mainWindowFrame: Mesh; // holds frame reference from the wall
    public readonly windowObject: ImportedObject; // window 3d object, will be a child of mainWindowFrame
    private readonly ownerWall: Wall; // wall parent

    private constructor(mainWindowFrame: Mesh, windowObject: ImportedObject, ownerWall: Wall) {
        this.mainWindowFrame = mainWindowFrame;
        this.windowObject = windowObject;
        this.ownerWall = ownerWall;
    }

    public static create(position: Position2D, parentWall: Wall) {
        const windowObject = ObjectFactory.loadWindow();
        const frameGeometry = this.createWindowFrame({
            length: windowObject.dimensions.length,
            height: windowObject.dimensions.height,
            width: parentWall.dimensions.width
        });
        const frameMesh = new Mesh(frameGeometry, parentWall.material);
        frameMesh.add(windowObject.mainMesh);
        frameMesh.position.set(position.x, position.y, 0);

        const window = new Window(frameMesh, windowObject, parentWall);
        parentWall.addWindow(window);

        return window;
    }

    private static createWindowFrame({length: l, height: h, width: w}: Dimensions) {
        const vertices: Array<Attributes> = [
            // those are different from wall, their normals face opposite directions
            // bottom
            { position: [  0,   0,   0], normal: Facing.UP, uv: [  0,   0] },
            { position: [  l,   0,   0], normal: Facing.UP, uv: [  l,   0] },
            { position: [  l,   0,  -w], normal: Facing.UP, uv: [  l,   w] },
            { position: [  l,   0,  -w], normal: Facing.UP, uv: [  l,   w] },
            { position: [  0,   0,  -w], normal: Facing.UP, uv: [  0,   w] },
            { position: [  0,   0,   0], normal: Facing.UP, uv: [  0,   0] },

            // top
            { position: [  0,   h,   0], normal: Facing.DOWN, uv: [  0,   0] },
            { position: [  0,   h,  -w], normal: Facing.DOWN, uv: [  0,   w] },
            { position: [  l,   h,  -w], normal: Facing.DOWN, uv: [  l,   w] },
            { position: [  l,   h,  -w], normal: Facing.DOWN, uv: [  l,   w] },
            { position: [  l,   h,   0], normal: Facing.DOWN, uv: [  l,   0] },
            { position: [  0,   h,   0], normal: Facing.DOWN, uv: [  0,   0] },

            // left
            { position: [  0,   0,   0], normal: Facing.RIGHT, uv: [  0,   0] },
            { position: [  0,   0,  -w], normal: Facing.RIGHT, uv: [  w,   0] },
            { position: [  0,   h,  -w], normal: Facing.RIGHT, uv: [  w,   h] },
            { position: [  0,   h,  -w], normal: Facing.RIGHT, uv: [  w,   h] },
            { position: [  0,   h,   0], normal: Facing.RIGHT, uv: [  0,   h] },
            { position: [  0,   0,   0], normal: Facing.RIGHT, uv: [  0,   0] },

            // right
            { position: [  l,   0,   0], normal: Facing.LEFT, uv: [  0,   0] },
            { position: [  l,   h,   0], normal: Facing.LEFT, uv: [  h,   0] },
            { position: [  l,   h,  -w], normal: Facing.LEFT, uv: [  h,   w] },
            { position: [  l,   h,  -w], normal: Facing.LEFT, uv: [  h,   w] },
            { position: [  l,   0,  -w], normal: Facing.LEFT, uv: [  0,   w] },
            { position: [  l,   0,   0], normal: Facing.LEFT, uv: [  0,   0] },
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

    public translateX(x: number) {
        this.mainWindowFrame.translateX(x);
        this.ownerWall.updateCutFrames();
    }

    public translateY(y: number) {
        this.mainWindowFrame.translateY(y);
        this.ownerWall.updateCutFrames();
    }

}
