import { Vector3 } from "three";
import { LiangBarsky } from "../../../app/drawer/components/LiangBarsky";

describe("Test Liang LiangBarsky clipping", () => {

  test("calculate collision and intersection points for bottom edge line fully contained in box", () => {
    // given
    const p0 = new Vector3(2, 0, 0);
    const p1 = new Vector3(8, 0, 0);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    // when
    const result = LiangBarsky.checkCollision(p0, p1, min, max);

    // then
    expect(result.isCollision).toBe(true);
    expect(result.edgeCollisionsCount).toBe(true);
    expect(result.p0).toBe(p0);
    expect(result.p1).toBe(p1);
  });

  test("calculate collision and intersection points for bottom edge line escaping to the right", () => {
    // given
    const p0 = new Vector3(2, 0, 0);
    const p1 = new Vector3(12, 0, 0);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    // when
    const result = LiangBarsky.checkCollision(p0, p1, min, max);

    // then
    expect(result.isCollision).toBe(true);
    expect(result.edgeCollisionsCount).toBe(true);
    expect(result.p0).toBe(p0);
    expect(result.p1).toStrictEqual(new Vector3(10, 0, 0));
  });

  test("calculate collision and intersection points for bottom edge line escaping to the left", () => {
    // given
    const p0 = new Vector3(-3, 0, 0);
    const p1 = new Vector3(8, 0, 0);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    // when
    const result = LiangBarsky.checkCollision(p0, p1, min, max);

    // then
    expect(result.isCollision).toBe(true);
    expect(result.edgeCollisionsCount).toBe(true);
    expect(result.p0).toStrictEqual(new Vector3(0, 0, 0));
    expect(result.p1).toBe(p1);
  });

  test("calculate collision and intersection points for bottom edge line escaping to both sides", () => {
    // given
    const p0 = new Vector3(-3, 0, 0);
    const p1 = new Vector3(14, 0, 0);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    // when
    const result = LiangBarsky.checkCollision(p0, p1, min, max);

    // then
    expect(result.isCollision).toBe(true);
    expect(result.edgeCollisionsCount).toBe(true);
    expect(result.p0).toStrictEqual(new Vector3(0, 0, 0));
    expect(result.p1).toStrictEqual(new Vector3(10, 0, 0));
  });

  test("calculate collision and intersection points for bottom edge having same length as box", () => {
    // given
    const p0 = new Vector3(0, 0, 0);
    const p1 = new Vector3(10, 0, 0);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    // when
    const result = LiangBarsky.checkCollision(p0, p1, min, max);

    // then
    expect(result.isCollision).toBe(true);
    expect(result.edgeCollisionsCount).toBe(true);
    expect(result.p0).toBe(p0);
    expect(result.p1).toBe(p1);
  });

  test("calculate collision and intersection points for top edge line", () => {
    // given
    const p0 = new Vector3(2, 0, 10);
    const p1 = new Vector3(8, 0, 10);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    // when
    const result = LiangBarsky.checkCollision(p0, p1, min, max);

    // then
    expect(result.isCollision).toBe(true);
    expect(result.edgeCollisionsCount).toBe(true);
    expect(result.p0).toBe(p0);
    expect(result.p1).toBe(p1);
  });

  test("calculate collision and intersection points for horizontal line inside box", () => {
    // given
    const p0 = new Vector3(2, 0, 5);
    const p1 = new Vector3(8, 0, 5);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    // when
    const result = LiangBarsky.checkCollision(p0, p1, min, max);

    // then
    expect(result.isCollision).toBe(true);
    expect(result.edgeCollisionsCount).toBe(false);
    expect(result.p0).toBe(p0);
    expect(result.p1).toBe(p1);
  });

  test("calculate collision and intersection points for vertical line inside box d->u", () => {
    // given
    const p0 = new Vector3(8, 0, 0);
    const p1 = new Vector3(8, 0, 10);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    // when
    const result = LiangBarsky.checkCollision(p0, p1, min, max);

    // then
    expect(result.isCollision).toBe(true);
    expect(result.edgeCollisionsCount).toBe(false);
    expect(result.p0).toBe(p0);
    expect(result.p1).toBe(p1);
  });

  test("calculate collision and intersection points for vertical line inside box u->d", () => {
    // given
    const p0 = new Vector3(8, 0, 10);
    const p1 = new Vector3(8, 0, 0);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    // when
    const result = LiangBarsky.checkCollision(p0, p1, min, max);

    // then
    expect(result.isCollision).toBe(true);
    expect(result.edgeCollisionsCount).toBe(false);
    expect(result.p0).toBe(p0);
    expect(result.p1).toBe(p1);
  });

  // non parallel
  test("calculate collision and intersection points for non parallel top edge colliding line", () => {
    // given
    const p0 = new Vector3(2, 0, 10);
    const p1 = new Vector3(2, 0, 14);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    // when
    const result = LiangBarsky.checkCollision(p0, p1, min, max);

    // then
    expect(result.isCollision).toBe(true);
    expect(result.edgeCollisionsCount).toBe(true);
    expect(result.p0).toStrictEqual(p0);
    expect(result.p1).toStrictEqual(p0);
  });

  test("calculate collision and intersection points for non parallel bottom edge colliding line", () => {
    // given
    const p0 = new Vector3(4, 0, 0);
    const p1 = new Vector3(2, 0, -5);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    // when
    const result = LiangBarsky.checkCollision(p0, p1, min, max);

    // then
    expect(result.isCollision).toBe(true);
    expect(result.edgeCollisionsCount).toBe(true);
    expect(result.p0).toStrictEqual(p0);
    expect(result.p1).toStrictEqual(p0);
  });

  test("calculate collision and intersection points for non parallel left edge colliding line", () => {
    // given
    const p0 = new Vector3(-4, 0, 5);
    const p1 = new Vector3(0, 0, 5);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    // when
    const result = LiangBarsky.checkCollision(p0, p1, min, max);

    // then
    expect(result.isCollision).toBe(true);
    expect(result.edgeCollisionsCount).toBe(true);
    expect(result.p0).toStrictEqual(p1);
    expect(result.p1).toStrictEqual(p1);
  });

  test("calculate collision and intersection points for non parallel right edge colliding line", () => {
    // given
    const p0 = new Vector3(15, 0, 8);
    const p1 = new Vector3(10, 0, 8);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    // when
    const result = LiangBarsky.checkCollision(p0, p1, min, max);

    // then
    expect(result.isCollision).toBe(true);
    expect(result.edgeCollisionsCount).toBe(true);
    expect(result.p0).toStrictEqual(p1);
    expect(result.p1).toStrictEqual(p1);
  });

  // invisibility
  test("calculate collision and intersection points for line above box", () => {
    // given
    const p0 = new Vector3(2, 0, 13);
    const p1 = new Vector3(8, 0, 11);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    // when
    const result = LiangBarsky.checkCollision(p0, p1, min, max);

    // then
    expect(result.isCollision).toBe(false);
    expect(result.edgeCollisionsCount).toBe(false);
    expect(result.p0).toBe(p0);
    expect(result.p1).toBe(p1);
  });

  test("calculate collision and intersection points for line below box", () => {
    // given
    const p0 = new Vector3(8, 0, -1);
    const p1 = new Vector3(2, 0, -3);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    // when
    const result = LiangBarsky.checkCollision(p0, p1, min, max);

    // then
    expect(result.isCollision).toBe(false);
    expect(result.edgeCollisionsCount).toBe(false);
    expect(result.p0).toBe(p0);
    expect(result.p1).toBe(p1);
  });

  test("calculate collision and intersection points for line to the left of the box", () => {
    // given
    const p0 = new Vector3(-8, 0, 8);
    const p1 = new Vector3(-10, 0, 5);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    // when
    const result = LiangBarsky.checkCollision(p0, p1, min, max);

    // then
    expect(result.isCollision).toBe(false);
    expect(result.edgeCollisionsCount).toBe(false);
    expect(result.p0).toBe(p0);
    expect(result.p1).toBe(p1);
  });

  test("calculate collision and intersection points for line to the right of the box", () => {
    // given
    const p0 = new Vector3(14, 0, -100);
    const p1 = new Vector3(16, 0, 100);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    // when
    const result = LiangBarsky.checkCollision(p0, p1, min, max);

    // then
    expect(result.isCollision).toBe(false);
    expect(result.edgeCollisionsCount).toBe(false);
    expect(result.p0).toBe(p0);
    expect(result.p1).toBe(p1);
  });




  // pen and paper

  test("pnp 00,22,01,21", () => {
    // given
    const p0 = new Vector3(0, 0, 1);
    const p1 = new Vector3(2, 0, 1);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(2, 0, 2);

    // when
    const result = LiangBarsky.checkCollision(p0, p1, min, max);

    // then
    expect(result.isCollision).toBe(true);
    expect(result.edgeCollisionsCount).toBe(false);
    expect(result.p0).toBe(p0);
    expect(result.p1).toBe(p1);
  });
});
