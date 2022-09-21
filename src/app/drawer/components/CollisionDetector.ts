import {Vector3} from "three";
import {ObjectPoint, ObjectPoints, ObjectSideOrientation} from "../constants/Types";
import {PlacedWall} from "../objects/wall/PlacedWall";
import {DrawerMath, WallConstruction} from "./DrawerMath";
import {CollisionType, LiangBarsky, LiangBarskyResult} from "./LiangBarsky";
import {IWallComponent} from "../objects/component/IWallComponent";
import {Direction} from "../objects/wall/Direction";
import {IObjectPointsOnScene} from "../objects/IObjectPointsOnScene";

export type Collision <T extends IObjectPointsOnScene> = {
    isCollision: boolean,
    adjacentObjects: Array<AdjacentObject<T>>,
}

export type AdjacentObject <T extends IObjectPointsOnScene> = {
    toSide: ObjectSideOrientation,
    adjacent: T,
    points: Array<Vector3>,
}

type CheckedSides = {
    top: boolean,
    right: boolean,
    bottom: boolean,
    left: boolean,
}

export const ALL_SIDES: CheckedSides = { top: true, right: true, bottom: true, left: true, };
export const LEFT_AND_RIGHT: CheckedSides = { top: false, right: true, bottom: false, left: true, };
export const TOP_AND_BOTTOM: CheckedSides = { top: true, right: false, bottom: true, left: false, };

export class CollisionDetector {

    /**
     * Finds only the first colliding object from {@link objects} array.
     * @param position
     * @param objects
     */
    public pickRectangularObjectWithPointer<T extends IObjectPointsOnScene>(position: Vector3, objects: Array<T>): T | undefined {
        for (const obj of objects) {
            const min = obj.getObjectPointsOnScene()[ObjectPoint.TOP_LEFT];
            const max = obj.getObjectPointsOnScene()[ObjectPoint.BOTTOM_RIGHT];
            if (DrawerMath.isPointBetweenMinMaxPoints(position, min, max)) {
                return obj;
            }
        }
        return undefined;
    }

    public detectAABBCollisions<T extends IObjectPointsOnScene>(checked: T, objects: Array<T>): T | undefined {
        return this.detectAABBCollisionsForObjectPoints(checked.getObjectPointsOnScene(), objects);
    }

    public detectAABBCollisionsForObjectPoints<T extends IObjectPointsOnScene>(points: ObjectPoints, objects: Array<T>): T | undefined {
        const topRight = points[ObjectPoint.BOTTOM_RIGHT];
        const bottomLeft = points[ObjectPoint.TOP_LEFT];
        for (const obj of objects) {
            const objPoints = obj.getObjectPointsOnScene();
            const wTopRight = objPoints[ObjectPoint.BOTTOM_RIGHT];
            const wBottomLeft = objPoints[ObjectPoint.TOP_LEFT];
            if (bottomLeft.x < wTopRight.x &&
                topRight.x > wBottomLeft.x &&
                bottomLeft.z < wTopRight.z &&
                topRight.z > wBottomLeft.z
            ) {
                return obj;
            }
        }
        return undefined;
    }

    /**
     * Finds collisions, each checked object is ordered horizontally or vertically.
     * @param points
     * @param otherSceneObjects
     * @param checkedSides
     * @returns 
     */
    public detectCollisions<T extends IObjectPointsOnScene> (
        points: ObjectPoints,
        otherSceneObjects: Array<T>,
        checkedSides: CheckedSides,
    ): Collision<T> {
        const bottomLeft = points[ObjectPoint.BOTTOM_LEFT];
        const bottomRight = points[ObjectPoint.BOTTOM_RIGHT];
        const topRight = points[ObjectPoint.TOP_RIGHT];
        const topLeft = points[ObjectPoint.TOP_LEFT];

        const adjacentObjects = new Array<AdjacentObject<T>>();

        for (const object of otherSceneObjects) {
            const checkedAgainstObjectPoints = object.getObjectPointsOnScene();
            const collisionPoints = new Array<Vector3>();
            let edgeCollisionsCount = 0;
            let wallSideType = ObjectSideOrientation.BOTTOM;

            let check;
            if (checkedSides.top) {
                check = CollisionDetector.checkLineCollision(bottomLeft, bottomRight, checkedAgainstObjectPoints);
                if ( check.type === CollisionType.EDGE ) {
                    edgeCollisionsCount++;
                    wallSideType = ObjectSideOrientation.BOTTOM;
                    collisionPoints.push(check.p0);
                    collisionPoints.push(check.p1);
                } else if ( check.type === CollisionType.NORMAL ) {
                    return { isCollision: true, adjacentObjects: adjacentObjects };
                }
            }

            if (checkedSides.right) {
                check = CollisionDetector.checkLineCollision(topRight, bottomRight, checkedAgainstObjectPoints);
                if ( check.type === CollisionType.EDGE ) {
                    edgeCollisionsCount++;
                    wallSideType = ObjectSideOrientation.RIGHT;
                    collisionPoints.push(check.p0);
                    collisionPoints.push(check.p1);
                } else if ( check.type === CollisionType.NORMAL ) {
                    return { isCollision: true, adjacentObjects: adjacentObjects };
                }
            }

            if (checkedSides.bottom) {
                check = CollisionDetector.checkLineCollision(topLeft, topRight, checkedAgainstObjectPoints);
                if ( check.type === CollisionType.EDGE ) {
                    edgeCollisionsCount++;
                    wallSideType = ObjectSideOrientation.TOP;
                    collisionPoints.push(check.p0);
                    collisionPoints.push(check.p1);
                } else if ( check.type === CollisionType.NORMAL ) {
                    return { isCollision: true, adjacentObjects: adjacentObjects };
                }
            }

            if (checkedSides.left) {
                check = CollisionDetector.checkLineCollision(topLeft, bottomLeft, checkedAgainstObjectPoints);
                if ( check.type === CollisionType.EDGE ) {
                    edgeCollisionsCount++;
                    wallSideType = ObjectSideOrientation.LEFT;
                    collisionPoints.push(check.p0);
                    collisionPoints.push(check.p1);
                } else if ( check.type === CollisionType.NORMAL ) {
                    return { isCollision: true, adjacentObjects: adjacentObjects };
                }
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
        const min = points[ObjectPoint.TOP_LEFT];
        const max = points[ObjectPoint.BOTTOM_RIGHT];
        return LiangBarsky.checkCollision(p0, p1, min, max);
    }

    /**
     * Finds wall that collide with front and back of the component. Other sides are allowed to collide.
     * @param component
     * @param walls 
     * @returns 
     */
    public detectComponentToWallCollisions(component: IWallComponent, walls: Array<PlacedWall>): Collision<PlacedWall> {
        const parentWall = component.getParentWall();
        if (parentWall === undefined) {
            throw new Error("Cannot find adjacent wall collision for component without parent wall.");
        }
        const placedWallsWithoutParentWall = CollisionDetector.getPlacedWallsWithoutProvidedWall(parentWall, walls);
        const points = component.getObjectPointsOnScene();
        const sides = CollisionDetector.pickComponentFrontAndBackSides(parentWall.props.direction);
        return this.detectCollisions(points, placedWallsWithoutParentWall, sides);
    }

    public detectWallToComponentCollisions(wallProps: WallConstruction, components: Array<IWallComponent>): Collision<IObjectPointsOnScene> {
        const resultArray = new Array<Collision<IObjectPointsOnScene>>();
        for (const component of components) {
            const parentWall = component.getParentWall();
            if (parentWall === undefined) {
                throw new Error("Cannot find adjacent wall collision for component without parent wall.");
            }
            const points = component.getObjectPointsOnScene();
            const sides = CollisionDetector.pickComponentFrontAndBackSides(parentWall.props.direction);
            resultArray.push(this.detectCollisions(points, [{ getObjectPointsOnScene: () => wallProps.points }], sides));
        }
        const adjacentObjects = resultArray.flatMap(collision => collision.adjacentObjects);
        const isCollision = resultArray.map(collision => collision.isCollision)
            .reduce((prev, current) => prev || current, false);
        return {
            adjacentObjects,
            isCollision,
        };
    }

    public static getPlacedWallsWithoutProvidedWall(providedWall: PlacedWall, placedWalls: Array<PlacedWall>): Array<PlacedWall> {
        return placedWalls.filter(wall => wall !== providedWall);
    }

    private static pickComponentFrontAndBackSides(componentWallDirection: Direction): CheckedSides {
        if (componentWallDirection === Direction.DOWN || componentWallDirection === Direction.UP) {
            return LEFT_AND_RIGHT;
        } else {
            return TOP_AND_BOTTOM;
        }
    }
}
