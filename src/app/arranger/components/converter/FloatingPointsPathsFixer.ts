import {PathProps} from "./PathPropsBuilder";
import {Vector2} from "three";
import {MathFloatingPoints} from "../../../common/components/MathFloatingPoints";

type BoundingPoints = { min: Vector2, max: Vector2 };

export class FloatingPointsPathsFixer {

    private readonly boundingPoints: BoundingPoints;

    public constructor(parentPath: PathProps) {
        this.boundingPoints = FloatingPointsPathsFixer.findBoundingPoints(parentPath);
    }

    /**
     * Fixes path points so that they are within bounds of parentPath that this object was initialized with.
     */
    public fix(toFix: PathProps): void {
        const { min, max } = this.boundingPoints; // aliases

        toFix.forEach(point => {
            let newX = point.x;
            if (point.x < min.x || MathFloatingPoints.areNumbersEqual(point.x, min.x)) {
                newX = min.x;
            }

            if (point.x > max.x || MathFloatingPoints.areNumbersEqual(point.x, max.x)) {
                newX = max.x;
            }

            let newY = point.y;
            if (point.y < min.y || MathFloatingPoints.areNumbersEqual(point.y, min.y)) {
                newY = min.y;
            }

            if (point.y > max.y || MathFloatingPoints.areNumbersEqual(point.y, max.y)) {
                newY = max.y;
            }
            point.setX(newX);
            point.setY(newY);
        });
    }

    private static findBoundingPoints(path: PathProps): BoundingPoints {
        const toProcess = [...path];
        toProcess.sort((a, b) => a.x - b.x);
        toProcess.sort((a, b) => a.y - b.y);
        return { min: toProcess[0], max: toProcess[toProcess.length - 1] };
    }
}
