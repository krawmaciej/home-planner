import {IFloor} from "./IFloor";
import {BufferGeometry, Line, LineBasicMaterial, MeshStandardMaterial, Scene, Vector3} from "three";
import {ObjectElevation, ObjectPoint, ObjectPoints} from "../../constants/Types";
import {AttributeName} from "../../../arranger/constants/Types";

export class Floor implements IFloor {

    private static readonly OUTLINE_MATERIAL = new LineBasicMaterial({
        color: 0x000000,
    });

    private readonly material: MeshStandardMaterial;
    private objectPoints: ObjectPoints;
    private outline: Line<BufferGeometry, LineBasicMaterial>;
    private diagonal: Line<BufferGeometry, LineBasicMaterial>;

    public constructor(start: Vector3, end: Vector3, material: MeshStandardMaterial) {
        this.material = material;
        this.objectPoints = Floor.calculateObjectPoints(start, end);
        const outlineGeo = new BufferGeometry().setFromPoints(
            [...this.objectPoints, this.objectPoints[ObjectPoint.BOTTOM_LEFT]]
        );
        this.outline = new Line(outlineGeo, Floor.OUTLINE_MATERIAL);
        const diagonalGeo = new BufferGeometry().setFromPoints(
            [this.objectPoints[ObjectPoint.BOTTOM_LEFT], this.objectPoints[ObjectPoint.TOP_RIGHT], this.objectPoints[ObjectPoint.BOTTOM_LEFT]]
        );
        this.diagonal = new Line(diagonalGeo, Floor.OUTLINE_MATERIAL);
    }

    private static calculateObjectPoints(p1: Vector3, p2: Vector3): ObjectPoints {
        const [minX, maxX] = p1.x < p2.x ? [p1.x, p2.x] : [p2.x, p1.x];
        const [minZ, maxZ] = p1.z < p2.z ? [p1.z, p2.z] : [p2.z, p1.z];

        const bottomLeft = new Vector3(minX, ObjectElevation.FLOOR, maxZ);
        const bottomRight = new Vector3(maxX, ObjectElevation.FLOOR, maxZ);
        const topRight = new Vector3(maxX, ObjectElevation.FLOOR, minZ);
        const topLeft = new Vector3(minX, ObjectElevation.FLOOR, minZ);

        return [bottomLeft, bottomRight, topRight, topLeft];
    }

    public addTo(scene: Scene): void {
        scene.add(this.outline);
        scene.add(this.diagonal);
    }

    public removeFrom(scene: Scene): void {
    }

    public getObjectPointsOnScene(): ObjectPoints {
        return this.objectPoints;
    }

    public change(start: Vector3, end: Vector3): void {
        this.objectPoints = Floor.calculateObjectPoints(start, end);
        const positions = this.outline.geometry.attributes[AttributeName.POSITION];
    }
}
