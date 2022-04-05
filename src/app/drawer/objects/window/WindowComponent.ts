import { BufferGeometry, Line, LineBasicMaterial, Material, Scene, Vector3 } from "three";
import WallComponent from "./WallComponent";

export type WindowProps = {
    length: number,
    width: number,
}

export default class WindowComponent implements WallComponent {

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
    
    public addTo(scene: Scene): void {
        scene.add(this.window);
    }

    public removeFrom(scene: Scene): void {
        scene.remove(this.window);
    }
}
