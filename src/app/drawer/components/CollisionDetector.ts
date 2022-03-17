import { Vector3 } from "three";
import DrawedWall from "../objects/DrawedWall";
import { WallConstruction, WallPoint } from "./DrawerMath";
import LiangBarsky, { LiangBarskyResult, CollisionType } from "./LiangBarsky";

export type Collision = {
    isCollision: boolean,
    adjecentWalls: Array<AdjecentWall>
}

export type AdjecentWall = {
    adjecent: DrawedWall,
    points: Array<Vector3>
}


export default class CollisionDetector {

    public detectAxisAlignedRectangleCollisions(checked: WallConstruction, walls: Array<DrawedWall>): boolean {
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

    public detectDrawedCollisions(checked: WallConstruction, walls: Array<DrawedWall>): Collision {
        const topLeft = checked.points[WallPoint.TOP_LEFT];
        const topRight = checked.points[WallPoint.TOP_RIGHT];
        const bottomRight = checked.points[WallPoint.BOTTOM_RIGHT];
        const bottomLeft = checked.points[WallPoint.BOTTOM_LEFT];

        const adjecentWalls = new Array<AdjecentWall>();

        for (let wall of walls) {
            const collisionPoints = new Array<Vector3>();
            let edgeCollisionsCount = 0;

            let check = this.checkLineCollision(topLeft, topRight, wall);
            if ( check.type === CollisionType.NORMAL_EDGE ) {
                edgeCollisionsCount++;
                collisionPoints.push(check.p0);
                collisionPoints.push(check.p1);
            } else if ( check.type === CollisionType.NORMAL ) {
                return { isCollision: true, adjecentWalls: adjecentWalls };
            }

            check = this.checkLineCollision(topRight, bottomRight, wall)
            if ( check.type === CollisionType.NORMAL_EDGE ) {
                edgeCollisionsCount++;
                collisionPoints.push(check.p0);
                collisionPoints.push(check.p1);
            } else if ( check.type === CollisionType.NORMAL ) {
                return { isCollision: true, adjecentWalls: adjecentWalls };
            }

            check = this.checkLineCollision(bottomRight, bottomLeft, wall)
            if ( check.type === CollisionType.NORMAL_EDGE ) {
                edgeCollisionsCount++;
                collisionPoints.push(check.p0);
                collisionPoints.push(check.p1);
            } else if ( check.type === CollisionType.NORMAL ) {
                return { isCollision: true, adjecentWalls: adjecentWalls };
            }

            check = this.checkLineCollision(bottomLeft, topLeft, wall)
            if ( check.type === CollisionType.NORMAL_EDGE ) {
                edgeCollisionsCount++;
                collisionPoints.push(check.p0);
                collisionPoints.push(check.p1);
            } else if ( check.type === CollisionType.NORMAL ) {
                return { isCollision: true, adjecentWalls: adjecentWalls };
            }

            if (edgeCollisionsCount === 1) {
                adjecentWalls.push({ adjecent: wall, points: collisionPoints });
            } else if (edgeCollisionsCount > 1) {
                return { isCollision: true, adjecentWalls: adjecentWalls };
            }
        }
        return { isCollision: false, adjecentWalls: adjecentWalls };
    }

    private checkLineCollision(p0: Vector3, p1: Vector3, wall: DrawedWall): LiangBarskyResult {
        const min = wall.props.points[WallPoint.BOTTOM_LEFT];
        const max = wall.props.points[WallPoint.TOP_RIGHT];
        return LiangBarsky.checkCollision(p0, p1, min, max);
    }
}