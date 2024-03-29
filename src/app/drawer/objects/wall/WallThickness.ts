
/**
 * Used to automatically calculate the halfThickness.
 */
export class WallThickness {
    public readonly thickness: number;
    public readonly halfThickness: number; // cached

    public constructor(thickness: number) {
        this.thickness = thickness;
        this.halfThickness = thickness / 2.0;
    }
}
