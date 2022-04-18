import { Vector3 } from "three";
import {ObjectPoints, ObjectPoint} from "../constants/Types";
import { ISceneObject } from "../objects/ISceneObject";
import { DrawedWall } from "../objects/wall/DrawedWall";
import { PlacedWall } from "../objects/wall/PlacedWall";
import { WallSideType } from "../objects/wall/WallSides";
import { DrawerMath, WallConstruction} from "./DrawerMath";
import { LiangBarsky, LiangBarskyResult, CollisionType } from "./LiangBarsky";

export type Collision = {
    isCollision: boolean,
    adjacentWalls: Array<AdjacentWall>,
}

export type AdjacentWall = {
    toSide: WallSideType
    adjacent: PlacedWall,
    points: Array<Vector3>,
}

export type CollidingWall = {
    wall: PlacedWall,
    collisionArea: number,
}

export class CollisionDetector {

    /**
     * Finds only the first colliding object from {@link objects} array.
     * @param position
     * @param objects
     */
    public pickRectangularObjectWithPointer<T extends ISceneObject>(position: Vector3, objects: Array<T>): T | undefined {
        for (const obj of objects) {
            const min = obj.objectPoints()[ObjectPoint.BOTTOM_LEFT];
            const max = obj.objectPoints()[ObjectPoint.TOP_RIGHT];
            if (DrawerMath.isPointBetweenMinMaxPoints(position, min, max)) {
                return obj;
            }
        }
        return undefined;
    }

    public detectAxisAlignedRectangleCollisions(checked: WallConstruction, walls: Array<DrawedWall>): boolean {
        const topRight = checked.points[ObjectPoint.TOP_RIGHT];
        const bottomLeft = checked.points[ObjectPoint.BOTTOM_LEFT];
        for (const wall of walls) {
            const wTopRight = wall.props.points[ObjectPoint.TOP_RIGHT];
            const wBottomLeft = wall.props.points[ObjectPoint.BOTTOM_LEFT];
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
    public detectWallCollisions({ points }: WallConstruction, walls: Array<PlacedWall>): Collision {
        const topLeft = points[ObjectPoint.TOP_LEFT];
        const topRight = points[ObjectPoint.TOP_RIGHT];
        const bottomRight = points[ObjectPoint.BOTTOM_RIGHT];
        const bottomLeft = points[ObjectPoint.BOTTOM_LEFT];

        const adjacentWalls = new Array<AdjacentWall>();

        for (const wall of walls) {
            const collisionPoints = new Array<Vector3>();
            let edgeCollisionsCount = 0;
            let wallSideType = WallSideType.TOP;

            // top
            let check = this.checkLineCollision(topLeft, topRight, wall.props.points);
            if ( check.type === CollisionType.NORMAL_EDGE ) {
                edgeCollisionsCount++;
                wallSideType = WallSideType.TOP;
                collisionPoints.push(check.p0);
                collisionPoints.push(check.p1);
            } else if ( check.type === CollisionType.NORMAL ) {
                return { isCollision: true, adjacentWalls: adjacentWalls };
            }

            // right
            check = this.checkLineCollision(bottomRight, topRight, wall.props.points);
            if ( check.type === CollisionType.NORMAL_EDGE ) {
                edgeCollisionsCount++;
                wallSideType = WallSideType.RIGHT;
                collisionPoints.push(check.p0);
                collisionPoints.push(check.p1);
            } else if ( check.type === CollisionType.NORMAL ) {
                return { isCollision: true, adjacentWalls: adjacentWalls };
            }

            // bottom
            check = this.checkLineCollision(bottomLeft, bottomRight, wall.props.points);
            if ( check.type === CollisionType.NORMAL_EDGE ) {
                edgeCollisionsCount++;
                wallSideType = WallSideType.BOTTOM;
                collisionPoints.push(check.p0);
                collisionPoints.push(check.p1);
            } else if ( check.type === CollisionType.NORMAL ) {
                return { isCollision: true, adjacentWalls: adjacentWalls };
            }

            // left
            check = this.checkLineCollision(bottomLeft, topLeft, wall.props.points);
            if ( check.type === CollisionType.NORMAL_EDGE ) {
                edgeCollisionsCount++;
                wallSideType = WallSideType.LEFT;
                collisionPoints.push(check.p0);
                collisionPoints.push(check.p1);
            } else if ( check.type === CollisionType.NORMAL ) {
                return { isCollision: true, adjacentWalls: adjacentWalls };
            }

            if (edgeCollisionsCount === 1) { // only one side collided, start and end must have been set
                adjacentWalls.push({ 
                    toSide: wallSideType,
                    adjacent: wall,
                    points: collisionPoints
                });
            } else if (edgeCollisionsCount > 1) {
                return { isCollision: true, adjacentWalls: adjacentWalls };
            }
        }
        return { isCollision: false, adjacentWalls: adjacentWalls };
    }

    private checkLineCollision(p0: Vector3, p1: Vector3, points: ObjectPoints): LiangBarskyResult {
        const min = points[ObjectPoint.BOTTOM_LEFT];
        const max = points[ObjectPoint.TOP_RIGHT];
        return LiangBarsky.checkCollision(p0, p1, min, max);
    }

    /**
     * Finds collisions, each wall check is ordered from left to right or bottom to top.
     * @param points
     * @param walls 
     * @returns 
     */
    public detectWindowWallCollisions(points : Array<Vector3>, walls: Array<PlacedWall>): Array<CollidingWall> {
        const topLeft = points[ObjectPoint.TOP_LEFT];
        const topRight = points[ObjectPoint.TOP_RIGHT];
        const bottomRight = points[ObjectPoint.BOTTOM_RIGHT];
        const bottomLeft = points[ObjectPoint.BOTTOM_LEFT];

        const collidingWalls = new Array<CollidingWall>();

        for (const wall of walls) {
            let collision = false;
            const horizontalSideCollidingLengths = new Array<number>();
            const verticalSideCollidingLengths = new Array<number>();
            // top
            let check = this.checkLineCollision(topLeft, topRight, wall.props.points);
            if ( (check.type & CollisionType.NORMAL) === CollisionType.NORMAL ) { // any kind of collision
                horizontalSideCollidingLengths.push(check.p0.distanceTo(check.p1));
                collision = true;
            }

            // right
            check = this.checkLineCollision(bottomRight, topRight, wall.props.points);
            if ( (check.type & CollisionType.NORMAL) === CollisionType.NORMAL ) { // any kind of collision
                verticalSideCollidingLengths.push(check.p0.distanceTo(check.p1));
            }

            // bottom
            check = this.checkLineCollision(bottomLeft, bottomRight, wall.props.points);
            if ( (check.type & CollisionType.NORMAL) === CollisionType.NORMAL ) { // any kind of collision
                horizontalSideCollidingLengths.push(check.p0.distanceTo(check.p1));
                collision = true;
            }

            // left
            check = this.checkLineCollision(bottomLeft, topLeft, wall.props.points);
            if ( (check.type & CollisionType.NORMAL) === CollisionType.NORMAL ) { // any kind of collision
                verticalSideCollidingLengths.push(check.p0.distanceTo(check.p1));
                collision = true;
            }

            if (!collision) {
                continue; // no meaningful collisions, check next wall
            }

            if (verticalSideCollidingLengths.length === 0 || horizontalSideCollidingLengths.length === 0) {
                // requires checking wall against component

            }

            const horizontalLength = this.average(horizontalSideCollidingLengths);
            const verticalLength = this.average(verticalSideCollidingLengths);
            collidingWalls.push({ wall: wall, collisionArea: horizontalLength * verticalLength });
        }

        return collidingWalls;
    }

    private average(array: Array<number>) {
        return array.reduce((a, b) => a + b) / array.length;
    }
}
