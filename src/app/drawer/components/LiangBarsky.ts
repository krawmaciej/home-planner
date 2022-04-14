import { Vector3 } from "three";

export type LiangBarskyResult = {
    p0: Vector3,
    p1: Vector3,
    type: CollisionType
}

export enum CollisionType {
    NONE = 0,
    NORMAL = 1,
    EDGE = 2, // only edge should not happen, use normal edge
    POINT = 4, // only point should not happen, use normal point
    NORMAL_EDGE = NORMAL | EDGE,
    NORMAL_POINT = NORMAL | POINT,
    EDGE_POINT = EDGE | POINT, // should not happen, use all instead
    ALL = NORMAL | EDGE | POINT
}

export class LiangBarsky {

    private tN = 0.0;
    private tF = 1.0;
    private edgeCollision = CollisionType.NONE;

    public static checkCollision(p0: Vector3, p1: Vector3, min: Vector3, max: Vector3): LiangBarskyResult {
        return new LiangBarsky().clip2DLine(p0, p1, min, max);
    }

    private clip2DLine(p0: Vector3, p1: Vector3, min: Vector3, max: Vector3): LiangBarskyResult {
        this.resetState(); // in case the same LiangBarsky object will be used twice

        const dx = p1.x - p0.x;
        const dz = p1.z - p0.z;

        if (this.calculateNewTs(dx, min.x - p0.x)) {
            if (this.calculateNewTs(-dx, p0.x - max.x)) {
                if (this.calculateNewTs(dz, min.z - p0.z)) {
                    if (this.calculateNewTs(-dz, p0.z - max.z)) {
                        let np0 = p0;
                        let np1 = p1;
                        let collisionType = CollisionType.NORMAL;

                        if (this.tF < 1.0) {
                            np1 = new Vector3(
                                p0.x + this.tF * dx,
                                p0.y,
                                p0.z + this.tF * dz
                            );
                        }
                        if (this.tN > 0.0) {
                            np0 = new Vector3(
                                p0.x + this.tN * dx,
                                p0.y,
                                p0.z + this.tN * dz
                            );
                        }
                        if (this.tN === this.tF) { // single point collision
                            collisionType |= CollisionType.POINT;
                        }
                        return { 
                            p0: np0,
                            p1: np1,
                            type: collisionType | this.edgeCollision
                        };
                    }
                }
            }
        }
        return {
            p0,
            p1,
            type: CollisionType.NONE
        };
    }

    private resetState() {
        this.tN = 0.0;
        this.tF = 1.0;
        this.edgeCollision = CollisionType.NONE;
    }

    private calculateNewTs(denom: number, number: number): boolean {
        if (denom > 0) {
            const t = number / denom;
            if (t > this.tF) {
                return false;
            } else if (t > this.tN) {
                this.tN = t;
            }
        } else if (denom < 0) {
            const t = number / denom;
            if (t < this.tN) {
                return false;
            } else if (t < this.tF) { // todo: fix this by adding else if (t < this.tL)
                this.tF = t;
            }
        } else if (number > 0) {
            return false;
        }
        // denom is delta, if delta is 0 then two points lay on same x or y coordinate
        // and if any of the points matches with any of the box edges then number will be equal to 0
        else if (number === 0.0) {
            this.edgeCollision = CollisionType.EDGE;
        }
        return true;
    }
}
