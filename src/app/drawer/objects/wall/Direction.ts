import { Vector2D } from "../../constants/Types";

/**
 * Holds constant values, which are used to tell in which direction the wall is drawn.
 * Front end end of the wall have to be distinguished to draw wall thickness correctly.
 */
export class Direction {
    public static readonly UP: Vector2D = { x: 0, y: 1 };
    public static readonly DOWN: Vector2D = { x: 0, y: -1 };
    public static readonly RIGHT: Vector2D = { x: 1, y: 0 };
    public static readonly LEFT: Vector2D = { x: -1, y: 0 };
}
