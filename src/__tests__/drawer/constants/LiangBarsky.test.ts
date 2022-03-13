import { Vector3 } from "three";
import LiangBarsky from "../../../app/drawer/constants/LiangBarsky";

describe("Test Liang Barsky clipping", () => {
  test("calculate collision and intersection points for bottom edge line fully contained in box", () => {
    // given
    const p0 = new Vector3(2, 0, 0);
    const p1 = new Vector3(8, 0, 0);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    const barsky = new LiangBarsky();
    
    // when
    const result = barsky.clip2DLine(p0, p1, min, max);

    // then
    expect(result.collidesWithBox).toBe(true);
    expect(result.isOnBoxEdge).toBe(true);
    expect(result.p0).toBe(p0);
    expect(result.p1).toBe(p1);
  });

  test("calculate collision and intersection points for bottom edge line escaping to the right", () => {
    // given
    const p0 = new Vector3(2, 0, 0);
    const p1 = new Vector3(12, 0, 0);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    const barsky = new LiangBarsky();
    
    // when
    const result = barsky.clip2DLine(p0, p1, min, max);

    // then
    expect(result.collidesWithBox).toBe(true);
    expect(result.isOnBoxEdge).toBe(true);
    expect(result.p0).toBe(p0);
    expect(result.p1).toStrictEqual(new Vector3(10, 0, 0));
  });

  test("calculate collision and intersection points for bottom edge line escaping to the left", () => {
    // given
    const p0 = new Vector3(-3, 0, 0);
    const p1 = new Vector3(8, 0, 0);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    const barsky = new LiangBarsky();
    
    // when
    const result = barsky.clip2DLine(p0, p1, min, max);

    // then
    expect(result.collidesWithBox).toBe(true);
    expect(result.isOnBoxEdge).toBe(true);
    expect(result.p0).toStrictEqual(new Vector3(0, 0, 0));
    expect(result.p1).toBe(p1);
  });

  test("calculate collision and intersection points for bottom edge line escaping to both sides", () => {
    // given
    const p0 = new Vector3(-3, 0, 0);
    const p1 = new Vector3(14, 0, 0);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    const barsky = new LiangBarsky();
    
    // when
    const result = barsky.clip2DLine(p0, p1, min, max);

    // then
    expect(result.collidesWithBox).toBe(true);
    expect(result.isOnBoxEdge).toBe(true);
    expect(result.p0).toStrictEqual(new Vector3(0, 0, 0));
    expect(result.p1).toStrictEqual(new Vector3(10, 0, 0));
  });

  test("calculate collision and intersection points for bottom edge having same length as box", () => {
    // given
    const p0 = new Vector3(0, 0, 0);
    const p1 = new Vector3(10, 0, 0);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    const barsky = new LiangBarsky();
    
    // when
    const result = barsky.clip2DLine(p0, p1, min, max);

    // then
    expect(result.collidesWithBox).toBe(true);
    expect(result.isOnBoxEdge).toBe(true);
    expect(result.p0).toBe(p0);
    expect(result.p1).toBe(p1);
  });

  test("calculate collision and intersection points for top edge line", () => {
    // given
    const p0 = new Vector3(2, 0, 10);
    const p1 = new Vector3(8, 0, 10);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    const barsky = new LiangBarsky();
    
    // when
    const result = barsky.clip2DLine(p0, p1, min, max);

    // then
    expect(result.collidesWithBox).toBe(true);
    expect(result.isOnBoxEdge).toBe(true);
    expect(result.p0).toBe(p0);
    expect(result.p1).toBe(p1);
  });


  // invisibility
  test("calculate collision and intersection points for line above box", () => {
    // given
    const p0 = new Vector3(2, 0, 13);
    const p1 = new Vector3(8, 0, 11);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    const barsky = new LiangBarsky();
    
    // when
    const result = barsky.clip2DLine(p0, p1, min, max);

    // then
    expect(result.collidesWithBox).toBe(false);
    expect(result.isOnBoxEdge).toBe(false);
    expect(result.p0).toBe(p0);
    expect(result.p1).toBe(p1);
  });

  test("calculate collision and intersection points for line below box", () => {
    // given
    const p0 = new Vector3(8, 0, -1);
    const p1 = new Vector3(2, 0, -3);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    const barsky = new LiangBarsky();
    
    // when
    const result = barsky.clip2DLine(p0, p1, min, max);

    // then
    expect(result.collidesWithBox).toBe(false);
    expect(result.isOnBoxEdge).toBe(false);
    expect(result.p0).toBe(p0);
    expect(result.p1).toBe(p1);
  });

  test("calculate collision and intersection points for line to the left of the box", () => {
    // given
    const p0 = new Vector3(-8, 0, 8);
    const p1 = new Vector3(-10, 0, 5);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    const barsky = new LiangBarsky();
    
    // when
    const result = barsky.clip2DLine(p0, p1, min, max);

    // then
    expect(result.collidesWithBox).toBe(false);
    expect(result.isOnBoxEdge).toBe(false);
    expect(result.p0).toBe(p0);
    expect(result.p1).toBe(p1);
  });

  test("calculate collision and intersection points for line to the right of the box", () => {
    // given
    const p0 = new Vector3(14, 0, -100);
    const p1 = new Vector3(16, 0, 100);

    const min = new Vector3(0, 0, 0);
    const max = new Vector3(10, 0, 10);

    const barsky = new LiangBarsky();
    
    // when
    const result = barsky.clip2DLine(p0, p1, min, max);

    // then
    expect(result.collidesWithBox).toBe(false);
    expect(result.isOnBoxEdge).toBe(false);
    expect(result.p0).toBe(p0);
    expect(result.p1).toBe(p1);
  });

});
