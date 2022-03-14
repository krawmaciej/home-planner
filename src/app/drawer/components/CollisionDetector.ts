import { Vector3 } from "three";
import Drawed from "../objects/Drawed";
import { WallConstruction, WallPoint } from "./DrawerMath";
import LiangBarsky from "./LiangBarsky";

export default class CollisionDetector {

    public detectDrawedCollisions(checked: WallConstruction, walls: Array<Drawed>) {
        const topLeft = checked.points[WallPoint.TOP_LEFT];
        const topRight = checked.points[WallPoint.TOP_RIGHT];
        const bottomRight = checked.points[WallPoint.BOTTOM_RIGHT];
        const bottomLeft = checked.points[WallPoint.BOTTOM_LEFT];
        for (let wall of walls) {
            if (this.checkLineCollision(topLeft, topRight, wall)) {
                return true;
            }

            if (this.checkLineCollision(topRight, bottomRight, wall)) {
                return true;
            }

            if (this.checkLineCollision(bottomRight, bottomLeft, wall)) {
                return true;
            }

            if (this.checkLineCollision(bottomLeft, topLeft, wall)) {
                return true;
            }
        }
        return false;
    }

    private checkLineCollision(topLeft: Vector3, topRight: Vector3, wall: Drawed): boolean {
        const min = wall.props.points[WallPoint.BOTTOM_LEFT];
        const max = wall.props.points[WallPoint.TOP_RIGHT];
        const result = LiangBarsky.checkCollision(topLeft, topRight, min, max);
        return result.isCollision && !result.isEdgeCollision;
    }
}