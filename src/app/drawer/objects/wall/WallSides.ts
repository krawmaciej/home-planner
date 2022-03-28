import { Line, Material, Points, Vector3 } from "three";
import { WallPoint } from "../../components/DrawerMath";
import WallSide from "./WallSide";

/**
 * Defensive typecheck for 4 element array.
 */
export type WallPoints = {
    points: [Vector3, Vector3, Vector3, Vector3]
}

export enum WallSideType {
    TOP, RIGHT, BOTTOM, LEFT
}

/**
 * Wraps map of wall sides.
 */
export default class WallSides {
    private readonly map: Map<WallSideType, WallSide>;

    public constructor(points: WallPoints) {
        this.map = new Map<WallSideType, WallSide>();
        this.putWallSides(points);
    }

    public createDrawableObjects(material: Material): Array<Line> {
        return Array.from(this.map.values()).flatMap(value => value.createDrawableObjects(material));
    }

    private putWallSides({ points }: WallPoints): void {
        this.putWallSide(points[WallPoint.TOP_LEFT], points[WallPoint.TOP_RIGHT], WallSideType.TOP);
        this.putWallSide(points[WallPoint.BOTTOM_LEFT], points[WallPoint.BOTTOM_RIGHT], WallSideType.BOTTOM);
        this.putWallSide(points[WallPoint.BOTTOM_LEFT], points[WallPoint.TOP_LEFT], WallSideType.LEFT);
        this.putWallSide(points[WallPoint.BOTTOM_RIGHT], points[WallPoint.TOP_RIGHT], WallSideType.RIGHT);
    }

    private putWallSide(p0: Vector3, p1: Vector3, type: WallSideType) {
        const wallSide = new WallSide(p0, p1, type);
        this.map.set(type, wallSide);
    }
}
