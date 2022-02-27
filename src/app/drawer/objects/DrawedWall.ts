import { BufferGeometry, Line, LineBasicMaterial, Vector2, Vector3 } from "three";
import DrawerMath from "../constants/DrawerMath";
import { Vector2D } from "../constants/Types";

export type CornerPoints = {
    topLeft: Vector3,
    bottomRight: Vector3,
    direction: Vector2D
}

export default class DrawedWall {
    
    private static readonly material = new LineBasicMaterial({
        color: 0x000000,
        depthTest: false
    });

    public readonly line: Line<BufferGeometry>; // wondering if this can be updated 

    public constructor(line: Line<BufferGeometry>) {
        this.line = line;
    }

    public static createWall(start: Vector3, end: Vector3): DrawedWall {

        // calculate 4 corner points
        const cornerPoints = DrawerMath.calculateCornerPoints(start, end);


        return this.wallFrom4Sides(cornerPoints);
        // might create 4 sides here
        // IMPORTANT: sides will have their own manipulation logic called from wall when there's collision
        // return created wall with direction and 4 corner points
    }

    private static wallFrom4Sides({topLeft: topLeft, bottomRight: bottomRight}: CornerPoints): DrawedWall {
        const points = [];
        points.push(topLeft.clone());
        points.push(new Vector3(bottomRight.x, topLeft.y, topLeft.z));
        points.push(bottomRight.clone());
        points.push(new Vector3(topLeft.x, bottomRight.y, bottomRight.z));
        points.push(topLeft.clone());

        const geometry = new BufferGeometry().setFromPoints(points);
        const line = new Line(geometry, DrawedWall.material);
        line.renderOrder = 1;

        return new DrawedWall(line);
        // console.log(cornerPoints);
        // console.log(direction);
    }

}
