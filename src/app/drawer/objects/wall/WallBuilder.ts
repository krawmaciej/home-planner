import {CircleGeometry, Mesh, MeshBasicMaterial, MeshBasicMaterialParameters, Vector3} from "three";
import { AdjacentObject, Collision } from "../../components/CollisionDetector";
import { DrawerMath, WallConstruction } from "../../components/DrawerMath";
import { DrawnWall } from "./DrawnWall";
import { PlacedWall } from "./PlacedWall";
import { WallThickness } from "./WallThickness";
import {ObjectElevation} from "../../constants/Types";

/**
 * Creates a wall properties from which the meshes will be created.
 * Used for collision detection and calculations which do not require meshes.
 */
export class WallBuilder {

    private static readonly middlePointMesh = WallBuilder.createPointMesh({ color: 0x000000 });
    private static readonly contactPointMesh = WallBuilder.createPointMesh({ color: 0xffff00 });

    private readonly props: WallConstruction;
    private collision: Collision<PlacedWall>;

    public constructor(props: WallConstruction) {
        this.props = props;
        this.collision = { isCollision: false, adjacentObjects: new Array<AdjacentObject<PlacedWall>>() };
    }
    
    public static createWall(start: Vector3, end: Vector3, wallThickness: WallThickness): WallBuilder {
        const wallPoints = DrawerMath.calculateWallPoints(start, end, wallThickness);
        return new WallBuilder(wallPoints);
    }

    public static createMiddlePoint(position: Vector3): Mesh<CircleGeometry, MeshBasicMaterial> {
        const newMesh = WallBuilder.middlePointMesh.clone();
        newMesh.position.copy(position);
        newMesh.position.setY(ObjectElevation.UI);
        return newMesh;
    }

    public static createContactPoint(position: Vector3): Mesh<CircleGeometry, MeshBasicMaterial> {
        const newMesh = WallBuilder.contactPointMesh.clone();
        newMesh.position.copy(position);
        newMesh.position.setY(ObjectElevation.UI);
        return newMesh;
    }

    public static createPointMesh(material: MeshBasicMaterialParameters): Mesh<CircleGeometry, MeshBasicMaterial> {
        const geometry = new CircleGeometry(0.17);
        const meshMaterial = new MeshBasicMaterial(material);
        const mesh = new Mesh(geometry, meshMaterial);
        mesh.rotateX(-Math.PI/2.0);
        return mesh;
    }

    public setCollisionWithWall(collision: Collision<PlacedWall>): WallBuilder {
        this.collision = collision;
        return this;
    }

    public setCollisionWithObject(collision: boolean): WallBuilder {
        this.collision = {
            isCollision: collision,
            adjacentObjects: new Array<AdjacentObject<PlacedWall>>(), // no contact points displayed
        };
        return this;
    }

    public createDrawnWall(): DrawnWall {
        const contactPoints = this.collision.adjacentObjects.flatMap(wall => wall.points);
        return DrawnWall.wallFromPoints(this.props, this.collision.isCollision, contactPoints);
    }

    public createPlacedWall(): PlacedWall {
        return PlacedWall.create(this.props, this.collision.adjacentObjects);
    }

    // getters
    public getProps(): WallConstruction {
        return this.props;
    }
}
