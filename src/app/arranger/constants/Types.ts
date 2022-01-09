
export type Position2D = {
    x: number,
    y: number
}

export type Dimensions = {
    length: number,
    height: number,
    width: number
}

export type Attributes = {
    position: Array<number>,
    normal: Array<number>,
    uv: Array<number>
}

export enum AttributeName {
    POSITION = "position",
    NORMAL = "normal",
    UV = "uv",
}

export enum AttributeNumber {
    POSITION = 3,
    NORMAL = 3,
    UV = 2,
}

export class Facing {
    public static readonly RIGHT = [1, 0, 0];
    public static readonly UP = [0, 1, 0];
    public static readonly FRONT = [0, 0, 1];
    public static readonly LEFT = [-1, 0, 0];
    public static readonly DOWN = [0, -1, 0];
    public static readonly BACK = [0, 0, -1];
}