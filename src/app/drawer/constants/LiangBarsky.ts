import { Vector3 } from "three";

export type NewPoints = {
    p0: Vector3,
    p1: Vector3,
    collidesWithBox: boolean,
    isOnBoxEdge: boolean 
}

export default class LiangBarsky {

    private tE = 0.0;
    private tL = 1.0;
    private isOnBoxEdge = false;

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
                        return { p0: np0, p1: np1, collidesWithBox: true, isOnBoxEdge: this.isOnBoxEdge };
                    }
                }
            }
        }
        const result = { p0, p1, collidesWithBox: false, isOnBoxEdge: this.isOnBoxEdge };
        this.tE = 0.0;
        this.tL = 1.0;
        this.isOnBoxEdge = false;
        return result;
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
            } else if (t < this.tL) { // todo: fix this by adding else if (t < this.tL)
                this.tL = t;
            }
        } else if (number > 0) {
            return false;
        }
        // denom is delta, if delta is 0 then two points lay on same x or y coordinate
        // and if any of the points matches with any of the box edges then number will be equal to 0
        if (number === 0.0) {
            this.isOnBoxEdge = true;
        }  
        return true;
    }

}