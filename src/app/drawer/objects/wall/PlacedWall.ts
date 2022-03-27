import { BufferGeometry, Line, LineBasicMaterial, Vector2, Vector3 } from "three";
import { AdjecentWall } from "../../components/CollisionDetector";
import { WallConstruction, WallPoint } from "../../components/DrawerMath";

export default class PlacedWall {
    
    private static readonly material = new LineBasicMaterial({
        color: 0x000000,
        depthTest: false
    });
    
    public static create(props: WallConstruction, adjecentWalls: AdjecentWall[]): PlacedWall {
        adjecentWalls.
        props.points[WallPoint.]
    }


}
