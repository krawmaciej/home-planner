import { Vector3 } from "three";
import Drawed from "../objects/Drawed";
import { WallConstruction, WallPoint } from "./DrawerMath";
import LiangBarsky, { CollisionResult } from "./LiangBarsky";

export default class CollisionDetector {

    public detectAxisAlignedRectangleCollisions(checked: WallConstruction, walls: Array<Drawed>): boolean {
        const topRight = checked.points[WallPoint.TOP_RIGHT];
        const bottomLeft = checked.points[WallPoint.BOTTOM_LEFT];
        for (let wall of walls) {
            const wTopRight = wall.props.points[WallPoint.TOP_RIGHT];
            const wBottomLeft = wall.props.points[WallPoint.BOTTOM_LEFT];
            if (bottomLeft.x < wTopRight.x &&
                topRight.x > wBottomLeft.x &&
                bottomLeft.z < wTopRight.z &&
                topRight.z > wBottomLeft.z
            ) {
                return true;
            }
        }
        return false;
    }

    public detectDrawedCollisions(checked: WallConstruction, walls: Array<Drawed>): boolean {
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

    private checkLineCollision(p0: Vector3, p1: Vector3, wall: Drawed): boolean {
        const min = wall.props.points[WallPoint.BOTTOM_LEFT];
        const max = wall.props.points[WallPoint.TOP_RIGHT];
        const result = LiangBarsky.checkCollision(p0, p1, min, max);
        return result.isCollision && !result.isEdgeCollision;
    }
}