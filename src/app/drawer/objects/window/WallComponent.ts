import {BufferGeometry, Line, LineBasicMaterial, Material, Object3D, Quaternion, Scene, Vector3} from "three";
import {DrawerMath} from "../../components/DrawerMath";
import {ObjectElevation, ObjectPoint, ObjectPoints, Vector2D} from "../../constants/Types";
import {IMovingWallComponent} from "./IMovingWallComponent";
import {IPlacedWallComponent} from "./IPlacedWallComponent";
import {Direction} from "../wall/Direction";
import {PlacedWall} from "../wall/PlacedWall";

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
    new Vector3(0, ObjectElevation.COMPONENT, 1.5),
    new Vector3(-0.5, ObjectElevation.COMPONENT, 1),
    new Vector3(0, ObjectElevation.COMPONENT, 1.5),
    new Vector3(0.5, ObjectElevation.COMPONENT, 1),
]);

type ComponentType = {
    shape: Line<BufferGeometry, Material>,
}

const DOOR_TYPE: ComponentType = {
    shape: new Line(ARROW_GEOMETRY, DEFAULT_MATERIAL),
};

const WINDOW_TYPE: ComponentType = {
    shape: new Line(ARROW_GEOMETRY, DEFAULT_MATERIAL),
};

export type ComponentProps = {
    readonly name: string,
    readonly thumbnail: string,
    readonly object3d?: Object3D,
    readonly width: number,
    readonly thickness: number,
    readonly height: number,
    readonly elevation: number,
}

export const DEFAULT_MUTABLE_WINDOW_PROPS = {
    name: "Otwór",
    thumbnail: "hole_thumbnail.jpg",
    width: 6,
    thickness: 1,
    height: 10,
    elevation: 9,
} as ComponentProps;

export const DEFAULT_MUTABLE_DOOR_PROPS = {
    name: "Otwór",
    thumbnail: "hole_thumbnail.jpg",
    width: 8,
    thickness: 1,
    height: 20,
    elevation: 0,
} as ComponentProps;

type XZLengths = {
    readonly x: number,
    readonly z: number,
}

export class WallComponent implements IMovingWallComponent, IPlacedWallComponent {

    public static createMovingDoor(props: ComponentProps): IMovingWallComponent {
        return new WallComponent(props, DEFAULT_MATERIAL, DOOR_TYPE);
    }

    public static createMovingWindow(props: ComponentProps): IMovingWallComponent {
        return new WallComponent(props, DEFAULT_MATERIAL, WINDOW_TYPE);
    }

    private static readonly FRONT_ROTATION = new Quaternion();
    private static readonly BACK_ROTATION = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI);
    private static readonly LEFT_ROTATION = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0),  - Math.PI / 2.0);
    private static readonly RIGHT_ROTATION = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2.0);
    private static readonly orientationQuaternionMap = new Map<Vector2D, Quaternion>([
        [Direction.DOWN, WallComponent.FRONT_ROTATION],
        [Direction.UP, WallComponent.BACK_ROTATION],
        [Direction.LEFT, WallComponent.LEFT_ROTATION],
        [Direction.RIGHT, WallComponent.RIGHT_ROTATION],
    ]);

    private readonly props: ComponentProps;
    private readonly window: Line<BufferGeometry, Material>;
    private orientation: Vector2D;
    private parentWall: undefined | PlacedWall; // not yet placed wall component can also have a parent wall
    private collided: boolean;
    private readonly type: ComponentType;

    public constructor(props: ComponentProps, material: LineBasicMaterial, type: ComponentType) {
        this.props = props;
        const points = WallComponent.createPoints(props);
        points.push(points[ObjectPoint.BOTTOM_LEFT]);
        const geometry = new BufferGeometry().setFromPoints(points).center();
        this.window = new Line(geometry, material ?? DEFAULT_MATERIAL);
        const typeShape = type.shape.clone();
        typeShape.material = material ?? DEFAULT_MATERIAL;
        this.window.add(typeShape);
        this.window.matrixAutoUpdate = false; // will be updated on each change position
        this.orientation = Direction.DOWN;
        this.collided = false;
        this.type = type;
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
        const placed = new WallComponent(this.props, PLACED_MATERIAL, this.type);
        placed.setParentWall(parentWall);
        placed.changePosition(this.window.position);
        return placed;
    }

    public addTo(scene: Scene): void {
        scene.add(this.window);
    }

    public removeFrom(scene: Scene): void {
        scene.remove(this.window);
        this.window.geometry.dispose();
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

        if (this.orientation === Direction.LEFT || this.orientation === Direction.RIGHT) {
            return [fourth, first, second, third];
        } else {
            return [first, second, third, fourth];
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
        const quaternion = WallComponent.orientationQuaternionMap.get(orientation);
        if (quaternion === undefined) {
            throw new Error("Wall component orientation has no quaternion mapped!");
        }
        console.log("Changing orientation: ", orientation);
        this.window.setRotationFromQuaternion(quaternion);
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

    public getElevation(): number {
        return this.props.elevation;
    }

    public getHeight(): number {
        return this.props.height;
    }

    public isDoor() {
        return this.type === DOOR_TYPE;
    }

    public getModel() {
        return this.props.object3d;
    }

    public getPosition(): Vector3 {
        return this.window.position.clone();
    }
}
