import {Line, Material, Vector3} from "three";
import {WallConstruction} from "../../components/DrawerMath";
import {WallSide} from "./WallSide";
import {ObjectPoint} from "../../constants/Types";
import {IWallComponent} from "../window/IWallComponent";

export enum WallSideType {
    TOP, RIGHT, BOTTOM, LEFT
}

/**
 * Wraps array of wall sides of a single wall.
 */
export class WallSides {
    
    private readonly wallSides: Array<WallSide>;

    public constructor(construction: WallConstruction) {
        this.wallSides = new Array<WallSide>(4);
        this.addWallSides(construction);
    }

    public putHole(side: WallSideType, points: Vector3[]): void {
        if (points.length !== 2) {
            console.warn("More than 2 points of adjacency from liang barsky!");
        }
        this.wallSides[side].cutBlock(points[0], points[1]);
    }

    public addComponent(side: WallSideType, component: IWallComponent) {
        this.wallSides[side].putComponent(component);
    }

    public removeComponent(side: WallSideType, component: IWallComponent) {
        this.wallSides[side].removeComponent(component);
    }

    public createDrawableObjects(material: Material): Array<Line> {
        return this.wallSides.flatMap(value => value.createDrawableObjects(material));
    }

    private addWallSides({ points }: WallConstruction): void {
        this.putWallSide(points[ObjectPoint.TOP_LEFT], points[ObjectPoint.TOP_RIGHT], WallSideType.TOP);
        this.putWallSide(points[ObjectPoint.BOTTOM_RIGHT], points[ObjectPoint.TOP_RIGHT], WallSideType.RIGHT);
        this.putWallSide(points[ObjectPoint.BOTTOM_LEFT], points[ObjectPoint.BOTTOM_RIGHT], WallSideType.BOTTOM);
        this.putWallSide(points[ObjectPoint.BOTTOM_LEFT], points[ObjectPoint.TOP_LEFT], WallSideType.LEFT);
    }

    private putWallSide(p0: Vector3, p1: Vector3, type: WallSideType) {
        this.wallSides[type] = new WallSide(p0, p1, type);
    }
}
