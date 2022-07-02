import {BufferGeometry, Line, LineBasicMaterial, Material, Object3D, Quaternion, Scene, Vector3} from "three";
import {DrawerMath} from "../../components/DrawerMath";
import {ObjectElevation, ObjectPoint, ObjectPoints, Vector2D} from "../../constants/Types";
import {IMovingWallComponent} from "./IMovingWallComponent";
import {IPlacedWallComponent} from "./IPlacedWallComponent";
import {Direction} from "../wall/Direction";
import {PlacedWall} from "../wall/PlacedWall";

export enum ComponentType {
    WINDOW, DOOR,
}

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
    width: 6,
    thickness: 1,
    height: 10,
    elevation: 9,
} as ComponentProps;

export const DEFAULT_MUTABLE_DOOR_PROPS = {
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
        return new WallComponent(props, WallComponent.defaultMaterial, ComponentType.DOOR);
    }

    public static createMovingWindow(props: ComponentProps): IMovingWallComponent {
        return new WallComponent(props, WallComponent.defaultMaterial, ComponentType.WINDOW);
    }

    private static readonly DEFAULT_ROTATION = new Quaternion();
    private static readonly RIGHT_ANGLE_ROTATION = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2.0);
    private static readonly directionQuaternionMap = new Map<Vector2D, Quaternion>([
        [Direction.RIGHT, WallComponent.DEFAULT_ROTATION],
        [Direction.LEFT, WallComponent.DEFAULT_ROTATION],
        [Direction.DOWN, WallComponent.RIGHT_ANGLE_ROTATION],
        [Direction.UP, WallComponent.RIGHT_ANGLE_ROTATION],
    ]);

    private static readonly defaultMaterial = new LineBasicMaterial({
        color: 0x333333,
    });

    private static readonly collidingMaterial = new LineBasicMaterial({
        color: 0xaa3333,
    });

    private static readonly placedMaterial = new LineBasicMaterial({
        color: 0x000000,
    });

    private readonly props: ComponentProps;
    private readonly window: Line<BufferGeometry, Material>;
    private direction: Vector2D;
    private parentWall: undefined | PlacedWall; // not yet placed wall component can also have a parent wall
    private collided: boolean;
    private type: ComponentType;

    public constructor(props: ComponentProps, material: LineBasicMaterial, type: ComponentType) {
        this.props = props;
        const points = WallComponent.createPoints(props);
        points.push(points[ObjectPoint.BOTTOM_LEFT]);
        const geometry = new BufferGeometry().setFromPoints(points).center();
        this.window = new Line(geometry, material ?? WallComponent.defaultMaterial);
        this.window.matrixAutoUpdate = false; // will be updated on each change position
        this.direction = Direction.RIGHT;
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
        const placed = new WallComponent(this.props, WallComponent.placedMaterial, this.type);
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

        if (this.direction === Direction.LEFT || this.direction === Direction.RIGHT) {
            return [first, second, third, fourth];
        } else {
            return [fourth, first, second ,third];
        }
    }

    public getXZLengths(): XZLengths {
        if (this.direction === Direction.LEFT || this.direction === Direction.RIGHT) {
            return {
                x: this.props.width,
                z: this.props.thickness,
            };
        } else {
            return {
                x: this.props.thickness,
                z: this.props.width,
            };
        }
    }

    public setParentWall(wall: PlacedWall) {
        this.parentWall = wall;
        this.changeRotation(wall.props.direction);
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

    private changeRotation(direction: Vector2D): void {
        this.direction = direction;
        const quaternion = WallComponent.directionQuaternionMap.get(direction);
        if (quaternion === undefined) {
            throw new Error("Wall component direction has no quaternion mapped!");
        }
        this.window.setRotationFromQuaternion(quaternion);
    }

    public getParentWall(): PlacedWall | undefined {
        return this.parentWall;
    }

    public setNotCollided(): void {
        this.collided = false;
        this.window.material = WallComponent.defaultMaterial;
    }

    public setCollided(): void {
        this.collided = true;
        this.window.material = WallComponent.collidingMaterial;
    }

    public collides(): boolean {
        return this.collided;
    }

    public getDirection(): Vector2D {
        return this.direction;
    }

    public getElevation(): number {
        return this.props.elevation;
    }

    public getHeight(): number {
        return this.props.height;
    }

    public isDoor() {
        return this.type === ComponentType.DOOR;
    }

    public getModel() {
        return this.props.object3d;
    }

    public getPosition(): Vector3 {
        return this.window.position.clone();
    }
}
