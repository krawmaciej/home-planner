import { Points, Vector3 } from "three";
import { WallPoint } from "../../components/DrawerMath";
import WallSide from "./WallSide";

/**
 * Defensive typecheck for 4 element array.
 */
export type WallPoints = {
    points: [Vector3, Vector3, Vector3, Vector3]
}

/**
 * Wraps map of wall sides.
 */
export default class WallSides {
    // map/array keys/indices
    public static readonly TOP = "TOP";
    public static readonly RIGHT = "RIGHT";
    public static readonly BOTTOM = "BOTTOM";
    public static readonly LEFT = "LEFT";

    private readonly map: Map<string, WallSide>;

    private constructor(map: Map<string, WallSide>) {
        this.map = map;
    }

    public static createFromPoints(points: Points): WallSides {
        const map = new Map<string, WallSide>();
        map.set()
    }
    
}