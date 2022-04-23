import { LineBasicMaterial, Line, BufferGeometry, Mesh, CircleGeometry, MeshBasicMaterial, Vector3, MeshBasicMaterialParameters, Scene } from "three";
import { WallConstruction, MiddlePoints} from "../../components/DrawerMath";
import {ObjectElevation, ObjectPoint} from "../../constants/Types";
import { IDrawedWall } from "./IDrawedWall";

/**
 * Creates Meshes from properties provided by {@link DrawedWallBuilder}.
 */
export class DrawedWall implements IDrawedWall {

    private static readonly contactPointMesh = DrawedWall.createPointMesh({ color: 0xffff00 });
    private static readonly middlePointMesh = DrawedWall.createPointMesh({ color: 0x000000 });

    private static createPointMesh(material: MeshBasicMaterialParameters): Mesh<CircleGeometry, MeshBasicMaterial> {
        const geometry = new CircleGeometry(0.17);
        const meshMaterial = new MeshBasicMaterial(material);
        const mesh = new Mesh(geometry, meshMaterial);
        mesh.rotateX(Math.PI*0.5);
        return mesh;
    }

    private static readonly material = new LineBasicMaterial({
        color: 0x000000,
    });

    private static readonly collidedMaterial = new LineBasicMaterial({
        color: 0xff0000,
    });

    public readonly props: WallConstruction;
    public readonly isCollided: boolean;
    public readonly wall: Line<BufferGeometry>;
    public readonly middle: Line<BufferGeometry>;
    public readonly anchorStart: Mesh<CircleGeometry, MeshBasicMaterial>;
    public readonly anchorEnd: Mesh<CircleGeometry, MeshBasicMaterial>;
    public readonly contactPoints: Array<Mesh<CircleGeometry, MeshBasicMaterial>>;

    private constructor(
        props: WallConstruction,
        isCollided: boolean,
        wall: Line<BufferGeometry>,
        middle: Line<BufferGeometry>,
        anchorStart: Mesh<CircleGeometry, MeshBasicMaterial>,
        anchorEnd: Mesh<CircleGeometry, MeshBasicMaterial>,
        contactPoints: Array<Mesh<CircleGeometry, MeshBasicMaterial>>
    ) {
        this.props = props;
        this.isCollided = isCollided;
        this.wall = wall;
        this.middle = middle;
        this.anchorStart = anchorStart;
        this.anchorEnd = anchorEnd;
        this.contactPoints = contactPoints;
        middle.add(anchorStart);
        middle.add(anchorEnd);
        wall.add(middle);
        contactPoints.forEach(mesh => wall.add(mesh));
    }

    public static wallFromPoints(props: WallConstruction, isCollided: boolean, contactPoints: Vector3[]): DrawedWall {
        const material = isCollided ? DrawedWall.collidedMaterial : DrawedWall.material;
        let contactPointsMeshes = new Array<Mesh<CircleGeometry, MeshBasicMaterial>>();
        if (!isCollided) {
            contactPointsMeshes = contactPoints.map(point => this.createContactPoint(point));
        }
        
        const wallGeometry = new BufferGeometry().setFromPoints(this.getWallPoints(props));
        const wall = new Line(wallGeometry, material);
        
        const middleGeometry = new BufferGeometry().setFromPoints(this.getMiddlePoints(props.middlePoints));
        const middle = new Line(middleGeometry, material);

        const p1 = this.createMiddlePoint(props.middlePoints.last);
        const p2 = this.createMiddlePoint(props.middlePoints.first);

        return new DrawedWall(props, isCollided, wall, middle, p1, p2, contactPointsMeshes);
    }

    private static createContactPoint(position: Vector3): Mesh<CircleGeometry, MeshBasicMaterial> {
        const newMesh = DrawedWall.contactPointMesh.clone();
        newMesh.position.copy(position);
        newMesh.position.setY(ObjectElevation.UI);
        return newMesh;
    }

    private static createMiddlePoint(position: Vector3): Mesh<CircleGeometry, MeshBasicMaterial> {
        const newMesh = DrawedWall.middlePointMesh.clone();
        newMesh.position.copy(position);
        newMesh.position.setY(ObjectElevation.UI);
        return newMesh;
    }

    private static getWallPoints({points}: WallConstruction): Vector3[] {
        return [...points, points[ObjectPoint.TOP_LEFT]];
    }

    private static getMiddlePoints({first: start, last: end}: MiddlePoints): Vector3[] {
        return [start, end];
    }

    public removeFrom(scene: Scene): void {
        scene.remove(this.wall);
    }
}
