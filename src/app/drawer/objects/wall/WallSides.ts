import {Line, Material, Vector3} from "three";
import {WallConstruction} from "../../components/DrawerMath";
import {WallSide} from "./WallSide";
import {ObjectPoint, ObjectSideOrientation} from "../../constants/Types";
import {IPlacedWallComponent} from "../component/IPlacedWallComponent";

/**
 * Wraps array of wall sides of a single wall.
 */
export class WallSides {
    
    private readonly wallSides: Array<WallSide>;

    public constructor(construction: WallConstruction) {
        this.wallSides = new Array<WallSide>(4);
        this.addWallSides(construction);
    }

    public putHole(side: ObjectSideOrientation, points: Vector3[]): void {
        if (points.length !== 2) {
            console.warn("More than 2 points of adjacency from liang barsky!");
        }
        this.wallSides[side].cutBlock(points[0], points[1]);
    }

    public addComponent(side: ObjectSideOrientation, component: IPlacedWallComponent) {
        this.wallSides[side].putComponent(component);
    }

    public removeComponent(side: ObjectSideOrientation, component: IPlacedWallComponent) {
        this.wallSides[side].removeComponent(component);
    }

    public createDrawableObjects(material: Material): Array<Line> {
        return this.wallSides.flatMap(value => value.createDrawableObjects(material));
    }

    public getWallSides(): Array<WallSide> {
        return [...this.wallSides];
    }

    private addWallSides({ points }: WallConstruction): void {
        this.putWallSide(points[ObjectPoint.BOTTOM_LEFT], points[ObjectPoint.BOTTOM_RIGHT], ObjectSideOrientation.BOTTOM);
        this.putWallSide(points[ObjectPoint.TOP_RIGHT], points[ObjectPoint.BOTTOM_RIGHT], ObjectSideOrientation.RIGHT);
        this.putWallSide(points[ObjectPoint.TOP_LEFT], points[ObjectPoint.TOP_RIGHT], ObjectSideOrientation.TOP);
        this.putWallSide(points[ObjectPoint.TOP_LEFT], points[ObjectPoint.BOTTOM_LEFT], ObjectSideOrientation.LEFT);
    }

    private putWallSide(p0: Vector3, p1: Vector3, type: ObjectSideOrientation) {
        this.wallSides[type] = new WallSide(p0, p1, type);
    }
}
