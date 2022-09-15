import { LineBasicMaterial, Line, BufferGeometry, Mesh, CircleGeometry, MeshBasicMaterial, Vector3, Scene } from "three";
import { WallConstruction} from "../../components/DrawerMath";
import {ObjectPoint, ObjectPoints} from "../../constants/Types";
import { IDrawnWall } from "./IDrawnWall";
import { createWallConstructionLabel} from "../../components/Labels";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {WallBuilder} from "./WallBuilder";

/**
 * Creates Meshes from properties provided by {@link WallBuilder}.
 */
export class DrawnWall implements IDrawnWall {

    private static readonly material = new LineBasicMaterial({
        color: 0x222222,
    });

    private static readonly middleMaterial = new LineBasicMaterial({
        color: 0x666666,
    });

    private static readonly collidedMaterial = new LineBasicMaterial({
        color: 0xaa2222,
    });

    public readonly props: WallConstruction;
    public readonly isCollided: boolean;
    public readonly wall: Line<BufferGeometry>;
    public readonly middle: Line<BufferGeometry>;
    public readonly anchorStart: Mesh<CircleGeometry, MeshBasicMaterial>;
    public readonly anchorEnd: Mesh<CircleGeometry, MeshBasicMaterial>;
    public readonly contactPoints: Array<Mesh<CircleGeometry, MeshBasicMaterial>>;
    private readonly label: CSS2DObject;

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
        const css2DObject = new CSS2DObject(createWallConstructionLabel(this.props.width));
        const middleVector = props.middlePoints.first.clone().add(props.middlePoints.last).multiplyScalar(0.5);
        css2DObject.position.x = middleVector.x;
        css2DObject.position.z = middleVector.z;
        this.label = css2DObject;
        middle.add(anchorStart);
        middle.add(anchorEnd);
        wall.add(middle);
        contactPoints.forEach(mesh => wall.add(mesh));
    }

    public static wallFromPoints(props: WallConstruction, isCollided: boolean, contactPoints: Vector3[]): DrawnWall {
        const material = isCollided ? DrawnWall.collidedMaterial : DrawnWall.material;
        const middleMaterial = isCollided ? DrawnWall.collidedMaterial : DrawnWall.middleMaterial;
        let contactPointsMeshes = new Array<Mesh<CircleGeometry, MeshBasicMaterial>>();
        if (!isCollided) {
            contactPointsMeshes = contactPoints.map(point => WallBuilder.createContactPoint(point));
        }
        
        const wallGeometry = new BufferGeometry().setFromPoints(this.getWallPoints(props));
        const wall = new Line(wallGeometry, material);
        
        const middleGeometry = new BufferGeometry().setFromPoints([props.middlePoints.first, props.middlePoints.last]);
        const middle = new Line(middleGeometry, middleMaterial);

        const p1 = WallBuilder.createMiddlePoint(props.middlePoints.last);
        const p2 = WallBuilder.createMiddlePoint(props.middlePoints.first);

        return new DrawnWall(props, isCollided, wall, middle, p1, p2, contactPointsMeshes);
    }

    private static getWallPoints({points}: WallConstruction): Vector3[] {
        return [...points, points[ObjectPoint.BOTTOM_LEFT]];
    }

    public addTo(scene: Scene): void {
        this.addLabel(); // re-add label to wall
        scene.add(this.wall);
    }

    public removeFrom(scene: Scene): void {
        this.removeLabel(); // removing object from scene doesn't remove label
        scene.remove(this.wall);
        this.wall.geometry.dispose();
        this.middle.geometry.dispose();
    }
    
    public addLabel(): void {
        this.wall.add(this.label);
    }
    
    public removeLabel(): void {
        this.wall.remove(this.label);
    }

    public getObjectPointsOnScene(): ObjectPoints {
        return this.props.points;
    }

    public highlight(): void {
        // no op for now
    }

    public unHighlight(): void {
        // no op for now
    }
}
