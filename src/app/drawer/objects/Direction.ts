import { Vector2D } from "../constants/Types";

export default class Direction {
    public static readonly UP: Vector2D = { x: 0, y: 1 };
    public static readonly DOWN: Vector2D = { x: 0, y: -1 };
    public static readonly RIGHT: Vector2D = { x: 1, y: 0 };
    public static readonly LEFT: Vector2D = { x: -1, y: 0 };
}
