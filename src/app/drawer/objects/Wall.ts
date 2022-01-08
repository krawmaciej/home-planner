import { BufferGeometry, Line, LineBasicMaterial, Vector2, Vector3 } from "three";

type Line2D = {
    a: number,
    b: number,
    c: number
}

export default class Wall {

    private static readonly material = new LineBasicMaterial({
        color: 0x00ffff
    });

    // start stop might be readonly, depends if meshes can be modified
    public start: Vector3;
    public stop: Vector3;
    public line2d: Line2D;
    public line: Line<BufferGeometry>; // wondering if this can be updated


    public constructor(start: Vector3, stop: Vector3) {
        this.start = start;
        this.stop = stop;
        this.line = Wall.createLine(start, stop);
        this.line2d = Wall.calculateLine2D(start, stop);
    }

    private static createLine(start: Vector3, stop: Vector3) {
        const points = [];
        points.push(start);
        points.push(stop);

        const geometry = new BufferGeometry().setFromPoints(points);
        return new Line(geometry, Wall.material);
    }

    static calculateLine2D(start: Vector3, stop: Vector3): Line2D {
        const x1 = start.x;
        const y1 = start.z;
        const x2 = stop.x;
        const y2 = stop.z;

        const a = y1 - y2;
        const b = x1 - x2;
        const c = a * x1 + b * y1;
        return {a: a, b: b, c: c};
    }

    public intersectionPoint(other: Wall) {
        const a1 = this.line2d.a;
        const b1 = this.line2d.b;
        const c1 = this.line2d.c;

        const a2 = other.line2d.a;
        const b2 = other.line2d.b;
        const c2 = other.line2d.c;

        const x = ((b1 * c2) - (b2 * c1)) / ((a1 * b2) - (a2 * b1));
        const y = ((c1 * a2) - (c2 * a1)) / ((a1 * b2) - (a2 * b1));

        console.log("calculate intersection point:");
        console.log(a1);
        console.log(b1);
        console.log(c1);

        console.log(a2);
        console.log(b2);
        console.log(c2);

        console.log(x);
        console.log(y);

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
