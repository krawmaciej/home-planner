import { BufferGeometry, Line, LineBasicMaterial, Vector2, Vector3 } from "three";

export default class Wall {

    private static readonly material = new LineBasicMaterial({
        color: 0x00ffff
    });

    // start stop might be readonly, depends if meshes can be modified
    private start: Vector3;
    private stop: Vector3;
    public line: Line<BufferGeometry>; // wondering if this can be updated


    public constructor(start: Vector3, stop: Vector3) {
        this.start = start;
        this.stop = stop;
        this.line = Wall.createLine(start, stop);
    }

    private static createLine(start: Vector3, stop: Vector3) {
        const points = [];
        points.push(start);
        points.push(stop);

        const geometry = new BufferGeometry().setFromPoints(points);
        return new Line(geometry, Wall.material);
    }





}
