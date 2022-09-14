import {
    BufferGeometry,
    Line,
    LineBasicMaterial,
    Material,
    MeshStandardMaterial,
    Object3D,
    Quaternion,
    Scene,
    Vector3
} from "three";
import {DrawerMath} from "../../components/DrawerMath";
import {
    DEFAULT_WALL_FRAME_MATERIAL,
    ObjectElevation,
    ObjectPoint,
    ObjectPoints, TextureProps,
    Vector2D
} from "../../constants/Types";
import {IMovingWallComponent} from "./IMovingWallComponent";
import {IPlacedWallComponent} from "./IPlacedWallComponent";
import {Direction} from "../wall/Direction";
import {PlacedWall} from "../wall/PlacedWall";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {createComponentPropsLabel} from "../../components/Labels";

const DEFAULT_MATERIAL = new LineBasicMaterial({
    color: 0x333333,
});

const COLLIDING_MATERIAL = new LineBasicMaterial({
    color: 0xaa3333,
});

const PLACED_MATERIAL = new LineBasicMaterial({
    color: 0x000000,
});

const ARROW_GEOMETRY = new BufferGeometry().setFromPoints([
    new Vector3(0, ObjectElevation.COMPONENT, 0),
    new Vector3(0, ObjectElevation.COMPONENT, -1.5),
    new Vector3(-0.5, ObjectElevation.COMPONENT, -1),
    new Vector3(0, ObjectElevation.COMPONENT, -1.5),
    new Vector3(0.5, ObjectElevation.COMPONENT, -1),
]);

export enum ComponentType {
    DOOR, WINDOW,
}

type ComponentShape = {
    shape: Line<BufferGeometry, Material>,
    placed: boolean,
    type: ComponentType,
    hiddenLabelProps: Array<keyof ComponentProps>,
}

const DOOR_SHAPE: ComponentShape = {
    shape: new Line(ARROW_GEOMETRY, DEFAULT_MATERIAL),
    placed: false,
    type: ComponentType.DOOR,
    hiddenLabelProps: ["elevation"],
};

const WINDOW_SHAPE: ComponentShape = {
    shape: new Line(ARROW_GEOMETRY, DEFAULT_MATERIAL),
    placed: false,
    type: ComponentType.WINDOW,
    hiddenLabelProps: [],
};

export type ComponentProps = {
    readonly thumbnail: string,
    readonly name: string,
    readonly fileIndex: number | undefined,
    readonly object3d: Object3D | undefined,
    width: number,
    readonly thickness: number,
    height: number,
    elevation: number,
    mutableFields: ComponentPropsMutableFields,
}

export type ComponentPropsMutableFields = {
    readonly width: boolean,
    readonly height: boolean,
    readonly elevation: boolean,
}

const NO_FILE_INDEX = undefined;
const NO_OBJECT = undefined;

export const DEFAULT_MUTABLE_WINDOW_PROPS: ComponentProps = {
    name: "Otwór",
    thumbnail: "hole_thumbnail.jpg",
    fileIndex: NO_FILE_INDEX,
    object3d: NO_OBJECT,
    width: 6,
    thickness: 1,
    height: 10,
    elevation: 9,
    mutableFields: { width: true, height: true, elevation: true },
};

export const DEFAULT_MUTABLE_DOOR_PROPS: ComponentProps = {
    name: "Otwór",
    thumbnail: "hole_thumbnail.jpg",
    fileIndex: NO_FILE_INDEX,
    object3d: NO_OBJECT,
    width: 8,
    thickness: 1,
    height: 20,
    elevation: 0,
    mutableFields: { width: true, height: true, elevation: false },
};

type XZLengths = {
    readonly x: number,
    readonly z: number,
}

export class WallComponent implements IMovingWallComponent, IPlacedWallComponent {

    public static createMovingDoor(props: ComponentProps): IMovingWallComponent {
        return new WallComponent(props, DEFAULT_MATERIAL, DOOR_SHAPE);
    }

    public static createMovingWindow(props: ComponentProps): IMovingWallComponent {
        return new WallComponent(props, DEFAULT_MATERIAL, WINDOW_SHAPE);
    }

    private static readonly FRONT_ROTATION = new Quaternion();
    private static readonly BACK_ROTATION = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI);
    private static readonly RIGHT_ROTATION = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0),  - Math.PI / 2.0);
    private static readonly LEFT_ROTATION = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2.0);
    private static readonly orientationQuaternionMap = new Map<Vector2D, Quaternion>([
        [Direction.DOWN, WallComponent.BACK_ROTATION],
        [Direction.UP, WallComponent.FRONT_ROTATION],
        [Direction.LEFT, WallComponent.LEFT_ROTATION],
        [Direction.RIGHT, WallComponent.RIGHT_ROTATION],
    ]);

    private readonly frameMaterial: MeshStandardMaterial;
    private readonly textureProps: TextureProps;
    public readonly props: ComponentProps;
    private readonly window: Line<BufferGeometry, LineBasicMaterial>;
    private orientation: Vector2D;
    private parentWall: undefined | PlacedWall; // not yet placed wall component can also have a parent wall
    private collided: boolean;
    private readonly shape: ComponentShape;
    private readonly label: CSS2DObject;

    public constructor(props: ComponentProps, material: LineBasicMaterial, shape: ComponentShape) {
        this.frameMaterial = DEFAULT_WALL_FRAME_MATERIAL.clone();
        this.textureProps = { rotation: 0 };
        this.props = props;
        const points = WallComponent.createPoints(props);
        points.push(points[ObjectPoint.BOTTOM_LEFT]);
        const geometry = new BufferGeometry().setFromPoints(points).center();
        this.window = new Line(geometry, material ?? DEFAULT_MATERIAL);
        if (shape.placed) {
            const typeShape = shape.shape.clone();
            typeShape.material = material ?? DEFAULT_MATERIAL;
            this.window.add(typeShape);
        }
        this.window.matrixAutoUpdate = false; // will be updated on each position change
        this.orientation = Direction.DOWN;
        this.collided = false;
        this.shape = shape;
        this.label = new CSS2DObject(createComponentPropsLabel(this.props, this.shape.hiddenLabelProps));
    }

    /**
     * Creates new vectors each time it is called because of mutable vectors.
     * @param props 
     * @returns 
     */
    private static createPoints(props: ComponentProps): ObjectPoints {
        const topLeft = new Vector3(0, ObjectElevation.COMPONENT, props.thickness);
        const topRight = new Vector3(props.width, ObjectElevation.COMPONENT, props.thickness);
        const bottomRight = new Vector3(props.width, ObjectElevation.COMPONENT, 0);
        const bottomLeft = new Vector3(0, ObjectElevation.COMPONENT, 0);
        return [topLeft, topRight, bottomRight, bottomLeft];
    }

    public changePosition(position: Vector3) {
        if (this.parentWall === undefined) {
            this.window.position.copy(position);
            this.window.updateMatrix();
            this.window.updateMatrixWorld(true);
            return;
        }

        const wallPoints = this.parentWall.getObjectPointsOnScene();
        const wallMin = wallPoints[ObjectPoint.TOP_LEFT];
        const wallMax = wallPoints[ObjectPoint.BOTTOM_RIGHT];

        const delta = position.clone().sub(this.window.position);

        const componentPoints = this.getObjectPointsOnScene();
        const componentMin = componentPoints[ObjectPoint.TOP_LEFT].add(delta);
        const componentMax = componentPoints[ObjectPoint.BOTTOM_RIGHT].add(delta);

        const componentLengths = this.getXZLengths();
        const newPosition = position.clone();

        if (componentMin.x < wallMin.x) {
            newPosition.x = wallMin.x + componentLengths.x/2;
        }

        if (componentMin.z < wallMin.z) {
            newPosition.z = wallMin.z + componentLengths.z/2;
        }

        if (componentMax.x > wallMax.x) {
            newPosition.x = wallMax.x - componentLengths.x/2;
        }

        if (componentMax.z > wallMax.z) {
            newPosition.z = wallMax.z - componentLengths.z/2;
        }

        this.window.position.copy(newPosition);
        this.window.updateMatrix();
        this.window.updateMatrixWorld(true);
    }

    public createPlacedComponent(parentWall: PlacedWall): IPlacedWallComponent {
        const placed = new WallComponent(this.props, PLACED_MATERIAL, { ...this.shape, placed: true });
        placed.setParentWall(parentWall);
        placed.changePosition(this.window.position);
        return placed;
    }

    public addTo(scene: Scene): void {
        this.addLabel(); // re-add label to window
        scene.add(this.window);
    }

    public removeFrom(scene: Scene): void {
        this.removeLabel(); // removing object from scene doesn't remove label
        scene.remove(this.window);
        this.window.geometry.dispose();
        this.frameMaterial.dispose();
        const material = this.window.material;
        if (![DEFAULT_MATERIAL, PLACED_MATERIAL, COLLIDING_MATERIAL].includes(material)) {
            material.dispose();
        }
    }

    public addLabel():void {
        this.window.add(this.label);
    }

    public removeLabel(): void {
        this.window.remove(this.label);
    }

    /**
     * Scene object has to have a scene to retrieve points on scene's coordinate system.
     */
    public getObjectPointsOnScene(): ObjectPoints {
        if (this.window.parent === undefined) {
            throw new Error("Wall component has to have a scene when retrieving its points");
        }
        const first = new Vector3(
            this.window.geometry.getAttribute("position").array[0],
            this.window.geometry.getAttribute("position").array[1],
            this.window.geometry.getAttribute("position").array[2],
        );

        const second = new Vector3(
            this.window.geometry.getAttribute("position").array[3],
            this.window.geometry.getAttribute("position").array[4],
            this.window.geometry.getAttribute("position").array[5],
        );

        const third = new Vector3(
            this.window.geometry.getAttribute("position").array[6],
            this.window.geometry.getAttribute("position").array[7],
            this.window.geometry.getAttribute("position").array[8],
        );

        const fourth = new Vector3(
            this.window.geometry.getAttribute("position").array[9],
            this.window.geometry.getAttribute("position").array[10],
            this.window.geometry.getAttribute("position").array[11],
        );

        // to world
        this.window.localToWorld(first);
        this.window.localToWorld(second);
        this.window.localToWorld(third);
        this.window.localToWorld(fourth);

        switch (this.orientation) {
            case Direction.DOWN:
                return [third, fourth, first, second];
            case Direction.LEFT:
                return [fourth, first, second, third];
            case Direction.UP:
                return [first, second, third, fourth];
            case Direction.RIGHT:
                return [second, third, fourth, first];
            default:
                throw new Error(`Component's ${JSON.stringify(this)} orientation: ${this.orientation} is invalid.`);
        }
    }

    public getXZLengths(): XZLengths {
        if (this.orientation === Direction.LEFT || this.orientation === Direction.RIGHT) {
            return {
                x: this.props.thickness,
                z: this.props.width,
            };
        } else {
            return {
                x: this.props.width,
                z: this.props.thickness,
            };
        }
    }

    public setParentWall(wall: PlacedWall) {
        this.parentWall = wall;
        if (wall.props.direction === Direction.LEFT || wall.props.direction === Direction.RIGHT) {
            this.changeOrientation(Direction.DOWN);
        } else {
            this.changeOrientation(Direction.LEFT);
        }
    }

    public unsetParentWall() {
        this.parentWall = undefined;
    }

    public getDistanceFromParentWall(): undefined | number {
        if (this.parentWall === undefined) {
            return undefined;
        }
        const componentBottomLeft = this.getObjectPointsOnScene()[ObjectPoint.BOTTOM_LEFT];
        const wallBottomLeft = this.parentWall.getObjectPointsOnScene()[ObjectPoint.BOTTOM_LEFT];
        return DrawerMath.distanceBetweenPoints(componentBottomLeft, wallBottomLeft);
    }

    public setDistanceFromParentWall(distance: number): void {
        if (this.parentWall === undefined) {
            return;
        }

        const componentBottomLeft = this.getObjectPointsOnScene()[ObjectPoint.BOTTOM_LEFT].clone();
        const wallBottomLeft = this.parentWall.getObjectPointsOnScene()[ObjectPoint.BOTTOM_LEFT].clone();

        // set Y values to the same number since Ys should be not considered in further calculations
        componentBottomLeft.setY(0);
        wallBottomLeft.setY(0);

        const oldDistanceVector = componentBottomLeft.sub(wallBottomLeft);
        const newDistanceVector = oldDistanceVector.clone().normalize().multiplyScalar(distance);
        const moveByVector = newDistanceVector.sub(oldDistanceVector);
        const newWindowMiddlePosition = this.window.position.clone().add(moveByVector);
        this.changePosition(newWindowMiddlePosition);
    }

    public changeOrientation(orientation: Vector2D): void {
        this.orientation = orientation;
        this.window.setRotationFromQuaternion(this.getRotation());
        this.window.updateMatrix();
        this.window.updateMatrixWorld(true);
    }

    public getParentWall(): PlacedWall | undefined {
        return this.parentWall;
    }

    public setNotCollided(): void {
        this.collided = false;
        this.window.traverse(it => {
            if (it instanceof Line) {
                it.material = DEFAULT_MATERIAL;
            }
        });
    }

    public setCollided(): void {
        this.collided = true;
        this.window.traverse(it => {
            if (it instanceof Line) {
                it.material = COLLIDING_MATERIAL;
            }
        });
    }

    public collides(): boolean {
        return this.collided;
    }

    public getOrientation(): Vector2D {
        return this.orientation;
    }

    public getRotation(): Quaternion {
        const quaternion = WallComponent.orientationQuaternionMap.get(this.orientation);
        if (quaternion === undefined) {
            throw new Error("Wall component orientation has no quaternion mapped!");
        }
        return quaternion;
    }

    public getElevation(): number {
        return this.props.elevation;
    }

    public getHeight(): number {
        return this.props.height;
    }

    public getWidth(): number {
        return this.props.width;
    }

    public getType(): ComponentType {
        return this.shape.type;
    }

    public getModel() {
        return this.props.object3d;
    }

    public getPosition(): Vector3 {
        return this.window.position.clone();
    }

    public getFrameMaterial(): MeshStandardMaterial {
        return this.frameMaterial;
    }

    public getTextureProps(): TextureProps {
        return this.textureProps;
    }
}
