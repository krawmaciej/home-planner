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
        const outlineGeo = new BufferGeometry().setFromPoints(this.getOutlinePoints());
        this.outline = new Line(outlineGeo, Floor.OUTLINE_MATERIAL);
        const diagonalGeo = new BufferGeometry().setFromPoints(this.getDiagonalPoints());
        this.diagonal = new Line(diagonalGeo, Floor.OUTLINE_MATERIAL);
    }

    private getOutlinePoints() {
        return [...this.objectPoints, this.objectPoints[ObjectPoint.BOTTOM_LEFT]];
    }

    private getDiagonalPoints() {
        return [this.objectPoints[ObjectPoint.BOTTOM_LEFT], this.objectPoints[ObjectPoint.TOP_RIGHT], this.objectPoints[ObjectPoint.BOTTOM_LEFT]];
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
        // update outline
        Floor.updateGeometry(this.outline.geometry, this.getOutlinePoints());
        // update diagonal
        Floor.updateGeometry(this.diagonal.geometry, this.getDiagonalPoints());
    }

    private static updateGeometry(geometry: BufferGeometry, newGeometryPoints: Array<Vector3>) {
        const positions = geometry.attributes[AttributeName.POSITION].array as Array<number>;
        const newPositions = newGeometryPoints.flatMap(v3 => [v3.x, v3.y, v3.z]);
        Floor.validatePositionsAndPoints(positions, newPositions);
        for (let i = 0; i < newPositions.length; i++) {
            positions[i] = newPositions[i];
        }
        geometry.attributes[AttributeName.POSITION].needsUpdate = true;
    }

    private static validatePositionsAndPoints(positions: Array<number>, points: Array<number>) {
        if (positions.length !== points.length) {
            throw new Error(
                `Floor geometry positions: ${positions} should have same number of elements as points: ${points}`
            );
        }
    }
}
