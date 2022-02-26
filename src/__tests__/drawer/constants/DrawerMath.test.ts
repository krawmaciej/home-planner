import { Vector3 } from "three";
import DrawerMath from "../../../app/drawer/constants/DrawerMath";
import Direction from "../../../app/drawer/objects/Direction";

describe("test add function", () => {
  it("calculateDirection should be right", () => {
    expect(DrawerMath.calculateDirection(
        new Vector3(0, 0, 0),
        new Vector3(1, 0, 0)
    )).toBe(Direction.RIGHT);
  });

  it("calculateDirection should be left", () => {
    expect(DrawerMath.calculateDirection(
        new Vector3(1, 0, 0),
        new Vector3(0, 0, 0)
    )).toBe(Direction.LEFT);
  });

  it("calculateDirection should be left", () => {
    expect(DrawerMath.calculateDirection(
        new Vector3(0, 0, 0.9),
        new Vector3(-1, 0, 0)
    )).toBe(Direction.LEFT);
  });

  it("calculateDirection should be up", () => {
    expect(DrawerMath.calculateDirection(
        new Vector3(0, 0, 0),
        new Vector3(0.8, 0, 0.9)
    )).toBe(Direction.UP);
  });

  it("calculateDirection should be down", () => {
    expect(DrawerMath.calculateDirection(
        new Vector3(0, 0, 0),
        new Vector3(1, 0, -1.1)
    )).toBe(Direction.DOWN);
  });
});
