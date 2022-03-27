import { Vector3 } from "three";
import DrawedWall from "../objects/wall/DrawedWall";
import WallSide from "../objects/wall/WallSide";
import { WallConstruction, WallPoint } from "./DrawerMath";
import LiangBarsky, { LiangBarskyResult, CollisionType } from "./LiangBarsky";

export type Collision = {
    isCollision: boolean,
    adjecentWalls: Array<AdjecentWall>
}

export type AdjecentWall = {
    toSide: WallSide
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

    /**
     * Finds collisions, each wall check is ordered from left to right or bottom to top.
     * @param checked 
     * @param walls 
     * @returns 
     */
    public detectDrawedCollisions(checked: WallConstruction, walls: Array<DrawedWall>): Collision {
        const topLeft = checked.points[WallPoint.TOP_LEFT];
        const topRight = checked.points[WallPoint.TOP_RIGHT];
        const bottomRight = checked.points[WallPoint.BOTTOM_RIGHT];
        const bottomLeft = checked.points[WallPoint.BOTTOM_LEFT];

        const adjecentWalls = new Array<AdjecentWall>();

        for (let wall of walls) {
            const collisionPoints = new Array<Vector3>();
            let edgeCollisionsCount = 0;
            let collidingSideStart: Vector3 = topLeft;
            let collidingSideEnd: Vector3 = topLeft;

            // top
            let check = this.checkLineCollision(topLeft, topRight, wall);
            if ( check.type === CollisionType.NORMAL_EDGE ) {
                edgeCollisionsCount++;
                collidingSideStart = topLeft;
                collidingSideEnd = topRight;
                collisionPoints.push(check.p0);
                collisionPoints.push(check.p1);
            } else if ( check.type === CollisionType.NORMAL ) {
                return { isCollision: true, adjecentWalls: adjecentWalls };
            }

            // right
            check = this.checkLineCollision(bottomRight, topRight, wall)
            if ( check.type === CollisionType.NORMAL_EDGE ) {
                edgeCollisionsCount++;
                collidingSideStart = bottomRight;
                collidingSideEnd = topRight;
                collisionPoints.push(check.p0);
                collisionPoints.push(check.p1);
            } else if ( check.type === CollisionType.NORMAL ) {
                return { isCollision: true, adjecentWalls: adjecentWalls };
            }

            // bottom
            check = this.checkLineCollision(bottomLeft, bottomRight, wall)
            if ( check.type === CollisionType.NORMAL_EDGE ) {
                edgeCollisionsCount++;
                collidingSideStart = bottomLeft;
                collidingSideEnd = bottomRight;
                collisionPoints.push(check.p0);
                collisionPoints.push(check.p1);
            } else if ( check.type === CollisionType.NORMAL ) {
                return { isCollision: true, adjecentWalls: adjecentWalls };
            }

            // left
            check = this.checkLineCollision(bottomLeft, topLeft, wall)
            if ( check.type === CollisionType.NORMAL_EDGE ) {
                edgeCollisionsCount++;
                collidingSideStart = bottomLeft;
                collidingSideEnd = topLeft;
                collisionPoints.push(check.p0);
                collisionPoints.push(check.p1);
            } else if ( check.type === CollisionType.NORMAL ) {
                return { isCollision: true, adjecentWalls: adjecentWalls };
            }

            if (edgeCollisionsCount === 1) { // only one side collided, start and end must have been set
                adjecentWalls.push({ 
                    start: collidingSideStart,
                    end: collidingSideEnd,
                    adjecent: wall,
                    points: collisionPoints
                });
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