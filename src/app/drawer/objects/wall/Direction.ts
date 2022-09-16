import { Vector2D } from "../../constants/Types";

/**
 * Holds constant values, which are used to tell in which direction the wall is drawn.
 * Front end end of the wall have to be distinguished to draw wall thickness correctly.
 */
export class Direction {
    public static readonly DOWN: Vector2D = { x: 0, z: 1 };
    public static readonly UP: Vector2D = { x: 0, z: -1 };
    public static readonly RIGHT: Vector2D = { x: 1, z: 0 };
    public static readonly LEFT: Vector2D = { x: -1, z: 0 };

    public static getOpposite(direction: Vector2D): Vector2D {
        return { x: -direction.x, z: -direction.z };
    }

    public static ofStrings(strings: { x: string, z: string }): Vector2D {
        const x = Number(strings.x);
        const z = Number(strings.z);

        if (x === 0 && z === 1) {
            return Direction.DOWN;
        }

        if (x === 0 && z === -1) {
            return Direction.UP;
        }

        if (x === 1 && z === 0) {
            return Direction.RIGHT;
        }

        if (x === -1 && z === 0) {
            return Direction.LEFT;
        }

        throw new Error(`No matching Vector2D for ${JSON.stringify(strings)}.`);
    }
}
