import { Line, Material, Vector3 } from "three";
import { WallConstruction, WallPoint } from "../../components/DrawerMath";
import WallSide from "./WallSide";

export enum WallSideType {
    TOP, RIGHT, BOTTOM, LEFT
}

/**
 * Wraps array of wall sides of a single wall.
 */
export default class WallSides {
    
    private readonly wallSides: Array<WallSide>;

    public constructor(construction: WallConstruction) {
        this.wallSides = new Array<WallSide>(4);
        this.addWallSides(construction);
    }

    public putHole(side: WallSideType, points: Vector3[]): void {
        if (points.length !== 2) {
            console.warn("More than 2 points of adjecency from liang barsky!");
        }
        this.wallSides[side].cutBlock(points[0], points[1]);
    }

    public createDrawableObjects(material: Material): Array<Line> {
        return this.wallSides.flatMap(value => value.createDrawableObjects(material));
    }

    private addWallSides({ points }: WallConstruction): void {
        this.putWallSide(points[WallPoint.TOP_LEFT], points[WallPoint.TOP_RIGHT], WallSideType.TOP);
        this.putWallSide(points[WallPoint.BOTTOM_RIGHT], points[WallPoint.TOP_RIGHT], WallSideType.RIGHT);
        this.putWallSide(points[WallPoint.BOTTOM_LEFT], points[WallPoint.BOTTOM_RIGHT], WallSideType.BOTTOM);
        this.putWallSide(points[WallPoint.BOTTOM_LEFT], points[WallPoint.TOP_LEFT], WallSideType.LEFT);
    }

    private putWallSide(p0: Vector3, p1: Vector3, type: WallSideType) {
        const wallSide = new WallSide(p0, p1, type);
        this.wallSides[type] = wallSide;
    }
}
