import {ISceneObject} from "../ISceneObject";
import {BufferGeometry, Line, LineBasicMaterial, Scene, Vector3} from "three";
import {ObjectElevation, ObjectPoints} from "../../constants/Types";
import {ObjectProps} from "../../../arranger/objects/ImportedObject";

export class ConvertedArrangerObject implements ISceneObject {

    private static readonly MATERIAL = new LineBasicMaterial({
        color: 0xdddddd,
    });

    private readonly props: ObjectProps;
    private readonly shape: Line<BufferGeometry, LineBasicMaterial>;

    public constructor(props: ObjectProps) {
        this.props = props;
        const geometry = new BufferGeometry().setFromPoints(ConvertedArrangerObject.getOutlinePoints(props));
        const shape = new Line(geometry, ConvertedArrangerObject.MATERIAL);
        shape.position.x = props.object3d.position.x;
        shape.position.z = props.object3d.position.z;
        shape.rotation.copy(props.object3d.rotation);
        this.shape = shape;
    }

    public getObjectPointsOnScene(): ObjectPoints {
        throw new Error("Called get object points on scene on Converted placed object");
    }

    public addTo(scene: Scene): void {
        this.addLabel();
        scene.add(this.shape);
    }

    public removeFrom(scene: Scene): void {
        this.removeLabel();
        scene.remove(this.shape);
        this.shape.geometry.dispose();
    }

    public addLabel(): void {
    }

    public removeLabel(): void {
    }

    private static getOutlinePoints(props: ObjectProps) {
        const x = props.width / 2.0;
        const z = props.thickness / 2.0;

        const bottomLeft = new Vector3(-x, ObjectElevation.ARRANGER_OBJECT, z);
        const bottomRight = new Vector3(x, ObjectElevation.ARRANGER_OBJECT, z);
        const topRight = new Vector3(x, ObjectElevation.ARRANGER_OBJECT, -z);
        const topLeft = new Vector3(-x, ObjectElevation.ARRANGER_OBJECT, -z);

        return [bottomLeft, bottomRight, topRight, topLeft, bottomLeft];
    }
}
