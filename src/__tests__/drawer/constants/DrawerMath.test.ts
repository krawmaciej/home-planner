import { Vector3 } from "three";
import {DrawerMath} from "../../../app/drawer/components/DrawerMath";
import {ObjectPoint} from "../../../app/drawer/constants/Types";
import { Direction } from "../../../app/drawer/objects/wall/Direction";
import {WallThickness} from "../../../app/drawer/objects/wall/WallThickness";

describe("test add function", () => {
  test("calculateDirection should be right", () => {
    expect(DrawerMath.calculateDirection(
        new Vector3(0, 0, 0),
        new Vector3(1, 0, 0)
    )).toBe(Direction.RIGHT);
  });

  test("calculateDirection should be left", () => {
    expect(DrawerMath.calculateDirection(
        new Vector3(1, 0, 0),
        new Vector3(0, 0, 0)
    )).toBe(Direction.LEFT);
  });

  test("calculateDirection should be left2", () => {
    expect(DrawerMath.calculateDirection(
        new Vector3(0, 0, 0.9),
        new Vector3(-1, 0, 0)
    )).toBe(Direction.LEFT);
  });

  test("calculateDirection should be up", () => {
    expect(DrawerMath.calculateDirection(
        new Vector3(0, 0, 0),
        new Vector3(0.8, 0, 0.9)
    )).toBe(Direction.DOWN);
  });

  test("calculateDirection should be down", () => {
    expect(DrawerMath.calculateDirection(
        new Vector3(0, 0, 0),
        new Vector3(1, 0, -1.1)
    )).toBe(Direction.UP);
  });

  test("calculateCornerPoints should be UP and top left be higer and to the left of bottom right", () => {
    // given
    const start = new Vector3(0.1, 0, 0.1);
    const end = new Vector3(0.5, 0, 1);
    const wT = new WallThickness(1.0);

    const expectedDirection = Direction.DOWN;

    // when
    const { points, direction } = DrawerMath.calculateWallPoints(start, end, wT, 4.0);

    // then
    expect(direction).toBe(expectedDirection);
    expect(points[ObjectPoint.BOTTOM_LEFT].x < points[ObjectPoint.BOTTOM_RIGHT].x).toBeTruthy();
    expect(points[ObjectPoint.TOP_LEFT].x < points[ObjectPoint.TOP_RIGHT].x).toBeTruthy();
    expect(points[ObjectPoint.BOTTOM_LEFT].z > points[ObjectPoint.TOP_LEFT].z).toBeTruthy();
    expect(points[ObjectPoint.BOTTOM_RIGHT].z > points[ObjectPoint.TOP_RIGHT].z).toBeTruthy();
  });

  test("calculateCornerPoints should be DOWN and top left be higer and to the left of bottom right", () => {
    // given
    const start = new Vector3(0.1, 0, 0.1);
    const end = new Vector3(1, 0, -1);
    const wT = new WallThickness(1.0);

    const expectedDirection = Direction.UP;

    // when
    const { points, direction } = DrawerMath.calculateWallPoints(start, end, wT, 4.0);

    // then
    expect(direction).toBe(expectedDirection);
    expect(points[ObjectPoint.BOTTOM_LEFT].x < points[ObjectPoint.BOTTOM_RIGHT].x).toBeTruthy();
    expect(points[ObjectPoint.TOP_LEFT].x < points[ObjectPoint.TOP_RIGHT].x).toBeTruthy();
    expect(points[ObjectPoint.BOTTOM_LEFT].z > points[ObjectPoint.TOP_LEFT].z).toBeTruthy();
    expect(points[ObjectPoint.BOTTOM_RIGHT].z > points[ObjectPoint.TOP_RIGHT].z).toBeTruthy();
  });

  test("calculateCornerPoints should be RIGHT and top left be higer and to the left of bottom right", () => {
    // given
    const start = new Vector3(0.1, 0, 0.1);
    const end = new Vector3(0.8, 0, 0.2);
    const wT = new WallThickness(1.0);

    const expectedDirection = Direction.RIGHT;

    // when
    const { points, direction } = DrawerMath.calculateWallPoints(start, end, wT, 4.0);

    // then
    expect(direction).toBe(expectedDirection);
    expect(points[ObjectPoint.BOTTOM_LEFT].x < points[ObjectPoint.BOTTOM_RIGHT].x).toBeTruthy();
    expect(points[ObjectPoint.TOP_LEFT].x < points[ObjectPoint.TOP_RIGHT].x).toBeTruthy();
    expect(points[ObjectPoint.BOTTOM_LEFT].z > points[ObjectPoint.TOP_LEFT].z).toBeTruthy();
    expect(points[ObjectPoint.BOTTOM_RIGHT].z > points[ObjectPoint.TOP_RIGHT].z).toBeTruthy();
  });

  test("calculateCornerPoints should be LEFT and top left be higer and to the left of bottom right", () => {
    // given
    const start = new Vector3(1, 0, 0.1);
    const end = new Vector3(0.8, 0, 0);
    const wT = new WallThickness(1.0);

    const expectedDirection = Direction.LEFT;

    // when
    const { points, direction } = DrawerMath.calculateWallPoints(start, end, wT, 4.0);

    // then
    expect(direction).toBe(expectedDirection);
    expect(points[ObjectPoint.BOTTOM_LEFT].x < points[ObjectPoint.BOTTOM_RIGHT].x).toBeTruthy();
    expect(points[ObjectPoint.TOP_LEFT].x < points[ObjectPoint.TOP_RIGHT].x).toBeTruthy();
    expect(points[ObjectPoint.BOTTOM_LEFT].z > points[ObjectPoint.TOP_LEFT].z).toBeTruthy();
    expect(points[ObjectPoint.BOTTOM_RIGHT].z > points[ObjectPoint.TOP_RIGHT].z).toBeTruthy();
  });

  test("calculateCornerPoints should be UP create corner box", () => {
    // given
    const start = new Vector3(0.5, 0, -0.1);
    const end = new Vector3(0.6, 0, 0.1);
    const wT = new WallThickness(1.0);

    const expectedDirection = Direction.DOWN;
    const expectedTopLeft = new Vector3(0, 0, 1);
    const expectedBottomRight = new Vector3(1, 0, -1);

    // when
    const { points, direction } = DrawerMath.calculateWallPoints(start, end, wT, 4.0);

    // then
    expect(direction).toBe(expectedDirection);
    expect(points[ObjectPoint.BOTTOM_LEFT]).toStrictEqual(expectedTopLeft);
    expect(points[ObjectPoint.TOP_RIGHT]).toStrictEqual(expectedBottomRight);
  });
});
