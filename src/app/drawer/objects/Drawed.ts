import { LineBasicMaterial, Line, BufferGeometry, Mesh, CircleGeometry, MeshBasicMaterial, Vector3 } from "three";
import { WallConstruction, MiddlePoints, WallPoint } from "../components/DrawerMath";


export default class Drawed {

    private static readonly material = new LineBasicMaterial({
        color: 0x000000,
        depthTest: false
    });

    private static readonly collidedMaterial = new LineBasicMaterial({
        color: 0xff0000,
        depthTest: false
    });

    public readonly props: WallConstruction;
    public readonly isCollided: boolean;
    public readonly wall: Line<BufferGeometry>;
    public readonly middle: Line<BufferGeometry>;
    public readonly anchorStart: Mesh<CircleGeometry, MeshBasicMaterial>;
    public readonly anchorEnd: Mesh<CircleGeometry, MeshBasicMaterial>;

    private constructor(
        props: WallConstruction,
        isCollided: boolean,
        wall: Line<BufferGeometry>,
        middle: Line<BufferGeometry>,
        anchorStart: Mesh<CircleGeometry, MeshBasicMaterial>,
        anchorEnd: Mesh<CircleGeometry, MeshBasicMaterial>
    ) {
        this.props = props;
        this.isCollided = isCollided;
        this.wall = wall;
        this.middle = middle;
        this.anchorStart = anchorStart;
        this.anchorEnd = anchorEnd;
        middle.add(anchorStart);
        middle.add(anchorEnd);
        wall.add(middle);
        // anchorStart.renderOrder = 1;
        // anchorEnd.renderOrder = 1;
        // middle.renderOrder = 1;
        // wall.renderOrder = 1;
    }

    public static wallFromPoints(props: WallConstruction, isCollided: boolean): Drawed {
        const material = isCollided ? Drawed.collidedMaterial : Drawed.material;
        
        const wallGeometry = new BufferGeometry().setFromPoints(this.getWallPoints(props));
        const wall = new Line(wallGeometry, material);
        
        const middleGeometry = new BufferGeometry().setFromPoints(this.getMiddlePoints(props.middlePoints));
        const middle = new Line(middleGeometry, material);

        const geometry = new CircleGeometry(0.1);
        const meshMaterial = new MeshBasicMaterial({ color: 0x000000 });
        const p1 = new Mesh(geometry, meshMaterial);
        // p1.position.set(middlePoints.bottom.x, 0, middlePoints.bottom.z);
        p1.position.copy(props.middlePoints.bottom);
        // p1.translateY(1);
        p1.rotateX(Math.PI*1.5);

        const p2 = p1.clone();
        p2.position.copy(props.middlePoints.top);
        // p1.renderOrder = 1;

        return new Drawed(props, isCollided, wall, middle, p1, p2);
        // console.log(cornerPoints);
        // console.log(direction);
    }

    private static getWallPoints({points}: WallConstruction): Vector3[] {
        return [...points, points[WallPoint.TOP_LEFT]];
    }

    private static getMiddlePoints({top: start, bottom: end}: MiddlePoints): Vector3[] {
        return [start, end];
    }

}
