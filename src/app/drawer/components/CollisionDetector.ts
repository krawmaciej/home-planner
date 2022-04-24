import {Vector3} from "three";
import {ObjectPoint, ObjectPoints, ObjectSideOrientation, Vector2D} from "../constants/Types";
import {ISceneObject} from "../objects/ISceneObject";
import {DrawedWall} from "../objects/wall/DrawedWall";
import {PlacedWall} from "../objects/wall/PlacedWall";
import {DrawerMath, WallConstruction} from "./DrawerMath";
import {CollisionType, LiangBarsky, LiangBarskyResult} from "./LiangBarsky";
import {IWallComponent} from "../objects/window/IWallComponent";
import {Direction} from "../objects/wall/Direction";

export type Collision <T extends ISceneObject> = {
    isCollision: boolean,
    adjacentObjects: Array<AdjacentObject<T>>,
}

export type AdjacentObject <T extends ISceneObject> = {
    toSide: ObjectSideOrientation
    adjacent: T,
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
            const min = obj.getObjectPointsOnScene()[ObjectPoint.BOTTOM_LEFT];
            const max = obj.getObjectPointsOnScene()[ObjectPoint.TOP_RIGHT];
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
     * Finds collisions, each checked object is ordered horizontally or vertically.
     * @param points
     * @param otherSceneObjects
     * @returns 
     */
    public detectCollisions<T extends ISceneObject>(points: ObjectPoints, otherSceneObjects: Array<T>): Collision<T> {
        const topLeft = points[ObjectPoint.TOP_LEFT];
        const topRight = points[ObjectPoint.TOP_RIGHT];
        const bottomRight = points[ObjectPoint.BOTTOM_RIGHT];
        const bottomLeft = points[ObjectPoint.BOTTOM_LEFT];

        const adjacentObjects = new Array<AdjacentObject<T>>();

        for (const object of otherSceneObjects) {
            const checkedAgainstObjectPoints = object.getObjectPointsOnScene();
            const collisionPoints = new Array<Vector3>();
            let edgeCollisionsCount = 0;
            let wallSideType = ObjectSideOrientation.TOP;

            // top
            let check = CollisionDetector.checkLineCollision(topLeft, topRight, checkedAgainstObjectPoints);
            if ( check.type === CollisionType.NORMAL_EDGE ) {
                edgeCollisionsCount++;
                wallSideType = ObjectSideOrientation.TOP;
                collisionPoints.push(check.p0);
                collisionPoints.push(check.p1);
            } else if ( check.type === CollisionType.NORMAL ) {
                return { isCollision: true, adjacentObjects: adjacentObjects };
            }

            // right
            check = CollisionDetector.checkLineCollision(bottomRight, topRight, checkedAgainstObjectPoints);
            if ( check.type === CollisionType.NORMAL_EDGE ) {
                edgeCollisionsCount++;
                wallSideType = ObjectSideOrientation.RIGHT;
                collisionPoints.push(check.p0);
                collisionPoints.push(check.p1);
            } else if ( check.type === CollisionType.NORMAL ) {
                return { isCollision: true, adjacentObjects: adjacentObjects };
            }

            // bottom
            check = CollisionDetector.checkLineCollision(bottomLeft, bottomRight, checkedAgainstObjectPoints);
            if ( check.type === CollisionType.NORMAL_EDGE ) {
                edgeCollisionsCount++;
                wallSideType = ObjectSideOrientation.BOTTOM;
                collisionPoints.push(check.p0);
                collisionPoints.push(check.p1);
            } else if ( check.type === CollisionType.NORMAL ) {
                return { isCollision: true, adjacentObjects: adjacentObjects };
            }

            // left
            check = CollisionDetector.checkLineCollision(bottomLeft, topLeft, checkedAgainstObjectPoints);
            if ( check.type === CollisionType.NORMAL_EDGE ) {
                edgeCollisionsCount++;
                wallSideType = ObjectSideOrientation.LEFT;
                collisionPoints.push(check.p0);
                collisionPoints.push(check.p1);
            } else if ( check.type === CollisionType.NORMAL ) {
                return { isCollision: true, adjacentObjects: adjacentObjects };
            }

            if (edgeCollisionsCount === 1) { // only one side collided, start and end must have been set
                adjacentObjects.push({
                    toSide: wallSideType,
                    adjacent: object,
                    points: collisionPoints
                });
            } else if (edgeCollisionsCount > 1) {
                return { isCollision: true, adjacentObjects: adjacentObjects };
            }
        }
        return { isCollision: false, adjacentObjects: adjacentObjects };
    }

    private static checkLineCollision(p0: Vector3, p1: Vector3, points: ObjectPoints): LiangBarskyResult {
        const min = points[ObjectPoint.BOTTOM_LEFT];
        const max = points[ObjectPoint.TOP_RIGHT];
        return LiangBarsky.checkCollision(p0, p1, min, max);
    }

    /**
     * Finds walls that collide with front and back of the component. Other sides are allowed to collide.
     * @param component
     * @param walls 
     * @returns 
     */
    public detectComponentAdjacentWallCollisions(component: IWallComponent, walls: Array<PlacedWall>
    ): Collision<PlacedWall> {
        const parentWall = component.getParentWall();
        if (parentWall === undefined) {
            throw new Error("Cannot find adjacent wall collision for component without parent wall.");
        }
        const placedWallsWithoutParentWall = CollisionDetector.getPlacedWallsWithoutParentWall(parentWall, walls);
        const points = component.getObjectPointsOnScene();
        const collision = this.detectCollisions(points, placedWallsWithoutParentWall);

        // check only front and back component side adjacent collisions
        return {
            isCollision: collision.isCollision,
            adjacentObjects: CollisionDetector.getOnlyFrontAndBackCollisions(collision, parentWall),
        };
    }

    public detectWallComponentCollisions(wallProps: WallConstruction, components: Array<IWallComponent>) {
        const componentsPerpendicularToWall = components.filter(
            cmp => ! CollisionDetector.areDirectionsSameOrientation(cmp.getDirection(), wallProps.direction)
        );
        return this.detectCollisions(wallProps.points, componentsPerpendicularToWall);
    }

    private static areDirectionsSameOrientation(direction: Vector2D, otherDirection: Vector2D): boolean {
        return direction === otherDirection || Direction.getOpposite(direction) === otherDirection;// todo: move to Direction and use are numbers equal
    }

    private static getOnlyFrontAndBackCollisions(collision: Collision<PlacedWall>, parentWall: PlacedWall) {
        const sideFilter = CollisionDetector.getSideFilterStrategy(parentWall);
        return collision.adjacentObjects.filter(sideFilter);
    }

    private static getSideFilterStrategy(parentWall: PlacedWall) {
        if (parentWall.props.direction === Direction.UP || parentWall.props.direction === Direction.DOWN) {
            return CollisionDetector.isSideVertical; // find only non-horizontal
        } else {
            return CollisionDetector.isSideHorizontal; // find only non-vertical
        }
    }

    private static isSideHorizontal(adjacentWall: AdjacentObject<PlacedWall>): boolean {
        return adjacentWall.toSide === ObjectSideOrientation.TOP || adjacentWall.toSide === ObjectSideOrientation.BOTTOM;
    }

    private static isSideVertical(adjacentWall: AdjacentObject<PlacedWall>): boolean {
        return adjacentWall.toSide === ObjectSideOrientation.LEFT || adjacentWall.toSide === ObjectSideOrientation.RIGHT;
    }

    private static average(array: Array<number>) {
        return array.reduce((a, b) => a + b) / array.length;
    }

    private static getPlacedWallsWithoutParentWall(parentWall: PlacedWall, placedWalls: Array<PlacedWall>): Array<PlacedWall> {
        return placedWalls.filter(wall => wall !== parentWall);
    }
}
