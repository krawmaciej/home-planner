import { BufferGeometry, Line, LineBasicMaterial, Material, Scene, Vector3 } from "three";
import IMovingWindowComponent from "./IMovingWindowComponent";
import IPlacedWindowComponent from "./IPlacedWindowComponent";
import IWallComponent from "./IWallComponent";

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
        const points = new Array<Vector3>();
        points.push(new Vector3(0, 0, 0));
        points.push(new Vector3(0, 0, this.props.width));
        points.push(new Vector3(this.props.length, 0, this.props.width));
        points.push(new Vector3(this.props.length, 0, 0));
        points.push(new Vector3(0, 0, 0));
        const geometry = new BufferGeometry().setFromPoints(points).center();
        this.window = new Line(geometry, WindowComponent.material);
    }

    public changePosition(position: Vector3) {
        this.window.position.copy(position);
    }

    public createPlacedComponent(position: Vector3): IPlacedWindowComponent {
        const placed = new WindowComponent(this.props);
        placed.changePosition(position);
        return placed;
    }

    public getPointsOnPlan(position: Vector3): Array<Vector3> {
        throw new Error("Method not implemented.");
    }

    public addTo(scene: Scene): WindowComponent {
        throw new Error("Method not implemented.");
    }

    public removeFrom(scene: Scene): WindowComponent {
        throw new Error("Method not implemented.");
    }
}
