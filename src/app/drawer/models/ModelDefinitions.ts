export type ModelDefinition = {
    name: string,
    file: string,
    thumbnail: string,
    doubleSided?: boolean,
    elevation?: number,
    dimensions: Dimensions,
    rotate: Rotation,
    offsetPosition: OffsetPosition,
    holeMargins: HoleMargins,
}

export type Dimensions = {
    width: number,
    height?: number,
    thickness?: number,
}

export type Rotation = {
    x: number,
    y: number,
    z: number,
}

export type OffsetPosition = Rotation;

export type HoleMargins = {
    horizontal: number,
    top: number,
    bottom: number,
}
