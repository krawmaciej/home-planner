import {IFloorCeiling} from "./IFloorCeiling";
import {BufferGeometry, Line, LineBasicMaterial, MeshStandardMaterial, Scene, Vector3} from "three";
import {ObjectElevation, ObjectPoint, ObjectPoints, PostProcessedTextureRotation} from "../../constants/Types";
import {AttributeName} from "../../../arranger/constants/Types";

export class FloorCeiling implements IFloorCeiling {

    private static readonly STANDARD_MATERIAL = new LineBasicMaterial({
        color: 0x444444,
    });
    private static readonly COLLIDED_MATERIAL = new LineBasicMaterial({
        color: 0xaa4444,
    });

    public readonly floorMaterial: MeshStandardMaterial;
    public readonly ceilingMaterial: MeshStandardMaterial;
    public readonly floorTextureRotation: PostProcessedTextureRotation;
    public readonly ceilingTextureRotation: PostProcessedTextureRotation;
    private readonly outline: Line<BufferGeometry, LineBasicMaterial>;
    private readonly diagonal: Line<BufferGeometry, LineBasicMaterial>;
    private objectPoints: ObjectPoints;

    public constructor(start: Vector3, end: Vector3, meshMaterial: MeshStandardMaterial) {
        this.floorMaterial = meshMaterial.clone();
        this.ceilingMaterial = meshMaterial.clone();
        this.floorTextureRotation = { value: 0 };
        this.ceilingTextureRotation = { value: 0 };
        this.objectPoints = FloorCeiling.calculateObjectPoints(start, end);
        const outlineGeo = new BufferGeometry().setFromPoints(this.getOutlinePoints());
        this.outline = new Line(outlineGeo, FloorCeiling.STANDARD_MATERIAL);
        const diagonalGeo = new BufferGeometry().setFromPoints(this.getDiagonalPoints());
        this.diagonal = new Line(diagonalGeo, FloorCeiling.STANDARD_MATERIAL);
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
        scene.remove(this.outline);
        scene.remove(this.diagonal);
        this.outline.geometry.dispose();
        this.diagonal.geometry.dispose();
    }

    public getObjectPointsOnScene(): ObjectPoints {
        return this.objectPoints;
    }

    public place(): FloorCeiling {
        return this;
    }

    public collide(): void {
        this.outline.material = FloorCeiling.COLLIDED_MATERIAL;
        this.diagonal.material = FloorCeiling.COLLIDED_MATERIAL;
    }

    public uncollide(): void {
        this.outline.material = FloorCeiling.STANDARD_MATERIAL;
        this.diagonal.material = FloorCeiling.STANDARD_MATERIAL;
    }

    public change(start: Vector3, end: Vector3): void {
        this.objectPoints = FloorCeiling.calculateObjectPoints(start, end);
        // update outline
        FloorCeiling.updateGeometry(this.outline.geometry, this.getOutlinePoints());
        // update diagonal
        FloorCeiling.updateGeometry(this.diagonal.geometry, this.getDiagonalPoints());
    }

    private static updateGeometry(geometry: BufferGeometry, newGeometryPoints: Array<Vector3>) {
        const positions = geometry.attributes[AttributeName.POSITION].array as Array<number>;
        const newPositions = newGeometryPoints.flatMap(v3 => [v3.x, v3.y, v3.z]);
        FloorCeiling.validatePositionsAndPoints(positions, newPositions);
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
