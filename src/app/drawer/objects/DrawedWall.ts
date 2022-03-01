import { BufferGeometry, CircleGeometry, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, Vector3 } from "three";
import DrawerMath, { CornerPoints, MiddlePoints, WallPoints } from "../constants/DrawerMath";
import { Vector2D } from "../constants/Types";
import WallThickness from "./WallThickness";

export default class DrawedWall {
    
    private static readonly material = new LineBasicMaterial({
        color: 0x000000,
        depthTest: false
    });

    public readonly wall: Line<BufferGeometry>;
    public readonly middle: Line<BufferGeometry>;
    public readonly anchorStart: Mesh<CircleGeometry, MeshBasicMaterial>;
    public readonly anchorEnd: Mesh<CircleGeometry, MeshBasicMaterial>;

    public constructor(
        wall: Line<BufferGeometry>,
        middle: Line<BufferGeometry>,
        anchorStart: Mesh<CircleGeometry, MeshBasicMaterial>,
        anchorEnd: Mesh<CircleGeometry, MeshBasicMaterial>
    ) {
        this.wall = wall;
        this.middle = middle;
        this.anchorStart = anchorStart;
        this.anchorEnd = anchorEnd;
        middle.add(anchorStart);
        middle.add(anchorEnd);
        wall.add(middle);
        anchorStart.renderOrder = 1;
        anchorEnd.renderOrder = 1;
        middle.renderOrder = 1;
        wall.renderOrder = 1;
    }

    public static createWall(start: Vector3, end: Vector3, wallThickness: WallThickness): DrawedWall {
        const wallPoints = DrawerMath.calculateWallPoints(start, end, wallThickness);


        return this.wallFromPoints(wallPoints);
        // might create 4 sides here
        // IMPORTANT: sides will have their own manipulation logic called from wall when there's collision
        // return created wall with direction and 4 corner points
    }

    private static wallFromPoints({cornerPoints, middlePoints}: WallPoints): DrawedWall {
        
        const wallGeometry = new BufferGeometry().setFromPoints(this.getLinePoints(cornerPoints));
        const wall = new Line(wallGeometry, DrawedWall.material);
        
        const middleGeometry = new BufferGeometry().setFromPoints(this.getMiddlePoints(middlePoints));
        const middle = new Line(middleGeometry, DrawedWall.material);

        const geometry = new CircleGeometry(1);
        const material = new MeshBasicMaterial({ color: 0x000000 });
        const p1 = new Mesh(geometry, material);
        // p1.position.copy(middlePoints.start);

        return new DrawedWall(wall, middle, p1, p1);
        // console.log(cornerPoints);
        // console.log(direction);
    }

    private static getLinePoints({topLeft, bottomRight}: CornerPoints): Vector3[] {
        const points = new Array<Vector3>();
        points.push(topLeft.clone());
        points.push(new Vector3(bottomRight.x, topLeft.y, topLeft.z));
        points.push(bottomRight.clone());
        points.push(new Vector3(topLeft.x, bottomRight.y, bottomRight.z));
        points.push(topLeft.clone());
        return points;
    }

    private static getMiddlePoints({start, end}: MiddlePoints): Vector3[] {
        return [ start, end ];
    }

}
