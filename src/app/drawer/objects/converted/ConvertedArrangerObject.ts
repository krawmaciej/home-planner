import {ISceneObject} from "../ISceneObject";
import {BufferGeometry, Line, LineBasicMaterial, Scene, Vector3} from "three";
import {ObjectElevation, ObjectPoints} from "../../constants/Types";
import {ObjectProps} from "../../../arranger/objects/ImportedObject";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {createConvertedArrangerObjectLabel} from "../../components/Labels";

export class ConvertedArrangerObject implements ISceneObject {

    private static readonly MATERIAL = new LineBasicMaterial({
        color: 0xdddddd,
    });

    private readonly props: ObjectProps;
    private readonly shape: Line<BufferGeometry, LineBasicMaterial>;
    private readonly label: CSS2DObject;

    public constructor(props: ObjectProps) {
        this.props = props;
        const geometry = new BufferGeometry().setFromPoints(ConvertedArrangerObject.getOutlinePoints(props));
        const shape = new Line(geometry, ConvertedArrangerObject.MATERIAL);
        shape.position.set(props.object3d.position.x, ObjectElevation.ARRANGER_OBJECT, props.object3d.position.z);
        shape.rotation.copy(props.object3d.rotation);
        this.shape = shape;
        this.label = new CSS2DObject(createConvertedArrangerObjectLabel(props.name));
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
        this.shape.add(this.label);
    }

    public removeLabel(): void {
        this.shape.remove(this.label);
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
