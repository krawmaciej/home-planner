import { BufferGeometry, Line, LineBasicMaterial, Material, Scene, Vector3 } from "three";
import { WallPoint } from "../../components/DrawerMath";
import IMovingWindowComponent from "./IMovingWindowComponent";
import IPlacedWindowComponent from "./IPlacedWindowComponent";

export type WindowProps = {
    length: number,
    width: number,
    // orientation: enum?
};

export default class WindowComponent implements IMovingWindowComponent, IPlacedWindowComponent {

    private static readonly material = new LineBasicMaterial({
        color: 0x000000,
        depthTest: false
    });

    public readonly props: WindowProps;
    private readonly window: Line<BufferGeometry, Material>;

    public constructor(props: WindowProps) {
        this.props = props;
        const points = WindowComponent.createPoints(props);
        points.push(points[WallPoint.TOP_LEFT]);
        const geometry = new BufferGeometry().setFromPoints(points).center();
        this.window = new Line(geometry, WindowComponent.material);
    }

    /**
     * Creates new vectors each time it is called becaue of mutable vectors.
     * @param props 
     * @returns 
     */
    private static createPoints(props: WindowProps): [Vector3, Vector3, Vector3, Vector3] {
        const topLeft = new Vector3(0, 0, props.width);
        const topRight = new Vector3(props.length, 0, props.width);
        const bottomRight = new Vector3(props.length, 0, 0);
        const bottomLeft = new Vector3(0, 0, 0);
        return [topLeft, topRight, bottomRight, bottomLeft];
    }

    public changePosition(position: Vector3) {
        this.window.position.copy(position);
    }

    public createPlacedComponent(position: Vector3): IPlacedWindowComponent {
        const placed = new WindowComponent(this.props);
        placed.changePosition(position);
        return placed;
    }

    public getPointsOnPlan(position: Vector3): [Vector3, Vector3, Vector3, Vector3] {
        this.window.position.copy(position);
        const points = WindowComponent.createPoints(this.props);

        const offset = new Vector3(this.props.length/2, 0, this.props.width/2);
        points.forEach(v => v.add(position).sub(offset)); // translate all points coordinates to grid
        return points;
    }

    public addTo(scene: Scene): void {
        scene.add(this.window);
    }

    public removeFrom(scene: Scene): void {
        scene.remove(this.window);
    }
}
