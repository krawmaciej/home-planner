import {BufferGeometry, Line, LineBasicMaterial, Material, Quaternion, Scene, Vector3} from "three";
import {DrawerMath} from "../../components/DrawerMath";
import {ObjectElevation, ObjectPoint, ObjectPoints, Vector2D} from "../../constants/Types";
import {IMovingWindowComponent} from "./IMovingWindowComponent";
import {IPlacedWindowComponent} from "./IPlacedWindowComponent";
import {Direction} from "../wall/Direction";
import {PlacedWall} from "../wall/PlacedWall";

export type WindowProps = {
    readonly length: number,
    readonly width: number,
}

type XZLengths = {
    readonly x: number,
    readonly z: number,
}

export class WindowComponent implements IMovingWindowComponent, IPlacedWindowComponent {

    private static readonly DEFAULT_ROTATION = new Quaternion();
    private static readonly RIGHT_ANGLE_ROTATION = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2.0);
    private static readonly directionQuaternionMap = new Map<Vector2D, Quaternion>([
        [Direction.RIGHT, WindowComponent.DEFAULT_ROTATION],
        [Direction.LEFT, WindowComponent.DEFAULT_ROTATION],
        [Direction.UP, WindowComponent.RIGHT_ANGLE_ROTATION],
        [Direction.DOWN, WindowComponent.RIGHT_ANGLE_ROTATION],
    ]);

    private static readonly material = new LineBasicMaterial({
        color: 0x000000,
    });

    public readonly props: WindowProps;
    private readonly window: Line<BufferGeometry, Material>;
    private direction: Vector2D;
    private parentWall: undefined | PlacedWall;

    public constructor(props: WindowProps) {
        this.props = props;
        const points = WindowComponent.createPoints(props);
        points.push(points[ObjectPoint.TOP_LEFT]);
        const geometry = new BufferGeometry().setFromPoints(points).center();
        this.window = new Line(geometry, WindowComponent.material);
        this.direction = Direction.RIGHT;
    }

    /**
     * Creates new vectors each time it is called because of mutable vectors.
     * @param props 
     * @returns 
     */
    private static createPoints(props: WindowProps): ObjectPoints {
        const topLeft = new Vector3(0, ObjectElevation.COMPONENT, props.width);
        const topRight = new Vector3(props.length, ObjectElevation.COMPONENT, props.width);
        const bottomRight = new Vector3(props.length, ObjectElevation.COMPONENT, 0);
        const bottomLeft = new Vector3(0, ObjectElevation.COMPONENT, 0);
        return [topLeft, topRight, bottomRight, bottomLeft];
    }

    public changePosition(position: Vector3) {
        if (this.parentWall === undefined) {
            this.window.position.copy(position);
            return;
        }

        const wallPoints = this.parentWall.objectPoints();
        const wallMin = wallPoints[ObjectPoint.BOTTOM_LEFT];
        const wallMax = wallPoints[ObjectPoint.TOP_RIGHT];

        const delta = position.clone().sub(this.window.position);

        const componentPoints = this.objectPoints();
        const componentMin = componentPoints[ObjectPoint.BOTTOM_LEFT].add(delta);
        const componentMax = componentPoints[ObjectPoint.TOP_RIGHT].add(delta);

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
    }

    public createPlacedComponent(): IPlacedWindowComponent {
        const placed = new WindowComponent(this.props);
        placed.changePosition(this.window.position);
        placed.changeRotation(this.direction);
        return placed;
    }

    public addTo(scene: Scene): void {
        scene.add(this.window);
    }

    public removeFrom(scene: Scene): void {
        scene.remove(this.window);
    }

    public objectPoints(): ObjectPoints {
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
                x: this.props.length,
                z: this.props.width,
            };
        } else {
            return {
                x: this.props.width,
                z: this.props.length,
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
        const componentBottomLeft = this.objectPoints()[ObjectPoint.BOTTOM_LEFT];
        const wallBottomLeft = this.parentWall.objectPoints()[ObjectPoint.BOTTOM_LEFT];
        return DrawerMath.distanceBetweenPoints(componentBottomLeft, wallBottomLeft);
    }

    private changeRotation(direction: Vector2D): void {
        if (this.direction === direction) {
            return;
        }

        this.direction = direction;
        const quaternion = WindowComponent.directionQuaternionMap.get(direction);
        if (quaternion === undefined) {
            throw new Error("Wall component direction has no quaternion mapped!");
        }
        this.window.setRotationFromQuaternion(quaternion);
    }

    public getParentWall(): PlacedWall | undefined {
        return this.parentWall;
    }
}
