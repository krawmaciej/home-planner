import {Vector2, Vector3} from "three";

export class MathFloatingPoints {

    public static readonly COMPARISON_ACCURACY = 0.01; // one millimeter, 1 is 10 cm

    public static areVectors2Equal(v1: Vector2, v2: Vector2): boolean {
        return (MathFloatingPoints.areNumbersEqual(v1.x, v2.x) && MathFloatingPoints.areNumbersEqual(v1.y, v2.y));
    }

    public static areVectors3Equal(v1: Vector3, v2: Vector3): boolean {
        return (
            MathFloatingPoints.areNumbersEqual(v1.x, v2.x) &&
            MathFloatingPoints.areNumbersEqual(v1.y, v2.y) &&
            MathFloatingPoints.areNumbersEqual(v1.z, v2.z)
        );
    }

    public static areNumbersEqual(n1: number, n2: number): boolean {
        return Math.abs( n1 - n2) <= MathFloatingPoints.COMPARISON_ACCURACY;
    }
}
