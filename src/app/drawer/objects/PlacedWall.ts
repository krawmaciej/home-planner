import { BufferGeometry, Line, LineBasicMaterial, Vector2, Vector3 } from "three";

type LineEquation = {
    a: number,
    b: number,
    c: number
}

export default class PlacedWall {

    private static readonly material = new LineBasicMaterial({
        color: 0x000000,
        depthTest: false
    });

    // start stop might be readonly, depends if meshes can be modified
    public start: Vector3;
    public stop: Vector3;
    public lineEquation: LineEquation;
    public line: Line<BufferGeometry>; // wondering if this can be updated 


    public constructor(start: Vector3, stop: Vector3) {
        this.start = start;
        this.stop = stop;
        this.line = PlacedWall.createLine(start, stop);
        this.lineEquation = PlacedWall.calculateLineEquation(start, stop);
    }

    private static createLine(start: Vector3, stop: Vector3) {
        const points = [];
        points.push(start);
        points.push(stop);

        const geometry = new BufferGeometry().setFromPoints(points);
        const line = new Line(geometry, PlacedWall.material);
        return line;
    }

    static calculateLineEquation(start: Vector3, stop: Vector3): LineEquation {
        const x1 = start.x;
        const y1 = start.z;
        const x2 = stop.x;
        const y2 = stop.z;

        const a = y1 - y2;
        const b = x2 - x1;
        const c = -a *x1 - b * y1;
        return {a: a, b: b, c: c};
    }

    public intersectionPoint(other: PlacedWall) {
        const a1 = this.lineEquation.a;
        const b1 = this.lineEquation.b;
        const c1 = this.lineEquation.c;

        const a2 = other.lineEquation.a;
        const b2 = other.lineEquation.b;
        const c2 = other.lineEquation.c;

        const x = ((b1 * c2) - (b2 * c1)) / ((a1 * b2) - (a2 * b1));
        const y = ((c1 * a2) - (c2 * a1)) / ((a1 * b2) - (a2 * b1));

        return new Vector2(x, y);
    }

    public move(newStop: Vector3) {
        // lazy initialize
        const stopXIndex = this.findStopXIndex();

        this.line.geometry.attributes.position.needsUpdate = true;
    }

    private findStopXIndex() {
        const positions = this.line.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i+=3) {
            if (positions[i] === this.stop.x) {
                return i;
            }
        }

        throw new Error("The point that should be there was not.");
    }


}
