import {Vector2} from "three";

export class ArrangerMath {

    public static perpendicularToVectorFrom(p1: Vector2, p2: Vector2): Vector2 {
        const vector = p1.clone().sub(p2);
        return ArrangerMath.perpendicularTo(vector);
    }

    public static perpendicularTo(vector: Vector2): Vector2 {
        return new Vector2(vector.y, -vector.x);
    }
}
