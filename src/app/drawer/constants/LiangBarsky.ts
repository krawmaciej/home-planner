import { Vector3 } from "three";

export type NewPoints = {
    p0: Vector3,
    p1: Vector3,
    visible: boolean
}

export default class LiangBarsky {

    private tE = 0.0;
    private tL = 1.0;

    public clip2DLine(p0: Vector3, p1: Vector3, min: Vector3, max: Vector3): NewPoints {
        const dx = p1.x - p0.x;
        const dz = p1.z - p0.z;

        if (this.calculateNewTs(dx, min.x - p0.x)) {
            if (this.calculateNewTs(-dx, p0.x - max.x)) {
                if (this.calculateNewTs(dz, min.z - p0.z)) {
                    if (this.calculateNewTs(-dz, p0.z - max.z)) {
                        let np0 = p0;
                        let np1 = p1;
                        if (this.tL < 1.0) {
                            np1 = new Vector3(
                                p0.x + this.tL * dx,
                                0,
                                p0.z + this.tL * dz
                            );
                        }
                        if (this.tE > 0.0) {
                            np0 = new Vector3(
                                p0.x + this.tE * dx,
                                0,
                                p0.z + this.tE * dz
                            );
                        }
                        return { p0: np0, p1: np1, visible: true };
                    }
                }
            }
        }
        this.tE = 0.0;
        this.tL = 1.0;
        return { p0, p1, visible: false };
    }

    private calculateNewTs(denom: number, number: number): boolean {
        if (denom > 0) {
            const t = number / denom;
            if (t > this.tL) {
                return false
            } else if (t > this.tE) {
                this.tE = t;
            }
        } else if (denom < 0) {
            const t = number / denom;
            if (t < this.tE) {
                return false;
            } else { // todo: fix this by adding else if
                this.tL = t;
            }
        } else if (number > 0) {
            return false;
        }
        return true;
    }

}