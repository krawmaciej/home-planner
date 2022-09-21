import {Vector2} from "three";
import {PathPropsBuilder} from "../../../app/arranger/components/converter/PathPropsBuilder";
import {CommonMathOperations} from "../../../app/common/components/CommonMathOperations";

describe("Test shape props builder", () => {

    test("A smaller that B on Y axis, should rotate to positive on X", () => {
        const a = new Vector2(5, 3);
        const b = new Vector2(5, 6);

        const forCalc = a.clone().sub(b);
        const angle = forCalc.angle();

        b.rotateAround(a, angle);

        expect(b.round()).toStrictEqual(new Vector2(8, 3)); // needs rounding in a separate class, close enough now
    });

    test("A larger than B on Y axis, should rotate to positive on X", () => {
        const a = new Vector2(5, 6);
        const b = new Vector2(5, 3);

        const forCalc = a.clone().sub(b);
        const angle = forCalc.angle();

        b.rotateAround(a, angle);

        expect(b.round()).toStrictEqual(new Vector2(8, 6)); // needs rounding in a separate class, close enough now
    });

    test("A smaller than B on X axis, should rotate to left of A", () => {
        const a = new Vector2(3, 6);
        const b = new Vector2(7, 6);

        const forCalc = a.clone().sub(b);
        const angle = forCalc.angle();

        b.rotateAround(a, angle);

        expect(b.round()).toStrictEqual(new Vector2(-1, 6)); // needs rounding in a separate class, close enough now
    });

    test("A larger than B on X axis, should rotate not rotate", () => {
        const a = new Vector2(8, 5);
        const b = new Vector2(1, 5);

        const forCalc = a.clone().sub(b);
        const angle = forCalc.angle();

        b.rotateAround(a, angle);

        expect(b.round()).toStrictEqual(new Vector2(1, 5)); // needs rounding in a separate class, close enough now
    });

    test("withHeight() for A larger than B on X axis", () => {
        // given
        const a = new Vector2(8, 5);
        const b = new Vector2(1, 5);
        const height = 5;
        const shapePropsCreator = new PathPropsBuilder(a, b).withHeight(height);

        const expected = [
            new Vector2(8, 5),
            new Vector2(8, 0),
            new Vector2(1, 0),
            new Vector2(1, 5),
            new Vector2(8, 5),
        ];

        // when
        const result = shapePropsCreator.build();

        // then
        checkFloatingPointEquality(expected, result);
    });

    test("withHeight() for B larger than A on X axis", () => {
        // given
        const a = new Vector2(1, 5);
        const b = new Vector2(8, 5);
        const height = 5;
        const shapePropsCreator = new PathPropsBuilder(a, b).withHeight(height);

        const expected = [
            new Vector2(1, 5),
            new Vector2(1, 10),
            new Vector2(8, 10),
            new Vector2(8, 5),
            new Vector2(1, 5),
        ];

        // when
        const result = shapePropsCreator.build();

        // then
        checkFloatingPointEquality(expected, result);
    });

    test("withHeight() for A larger than B on Y axis", () => {
        // given
        const a = new Vector2(3, 7);
        const b = new Vector2(3, 2);
        const height = 5;
        const shapePropsCreator = new PathPropsBuilder(a, b).withHeight(height);

        const expected = [
            new Vector2(3, 7),
            new Vector2(8, 7),
            new Vector2(8, 2),
            new Vector2(3, 2),
            new Vector2(3, 7),
        ];

        // when
        const result = shapePropsCreator.build();

        // then
        checkFloatingPointEquality(expected, result);
    });

    test("withHeight() for A larger than B on Y axis", () => {
        // given
        const a = new Vector2(3, 2);
        const b = new Vector2(3, 7);
        const height = 5;
        const pathPropsCreator = new PathPropsBuilder(a, b).withHeight(height);

        const expected = [
            new Vector2(3, 2),
            new Vector2(7, 2),
            new Vector2(7, 7),
            new Vector2(3, 7),
            new Vector2(3, 2),
        ];

        // when
        const result = pathPropsCreator.build();

        // then
        checkFloatingPointEquality(expected, result);
    });
});

const checkFloatingPointEquality = (expected: Vector2[], actual: Vector2[]): void => {
    expect(actual.length).toBe(expected.length);

    for (let i = 0; i < expected.length; i++) {
        expect(CommonMathOperations.areVectors2Equal(actual[i], expected[i])).toBeTruthy();
    }
};
