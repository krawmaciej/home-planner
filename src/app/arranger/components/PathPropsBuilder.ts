import {Vector2} from "three";
import {ArrangerMath} from "./ArrangerMath";

export type PathProps = [Vector2, Vector2, Vector2, Vector2, Vector2]

export class PathPropsBuilder {

    private readonly firstPoint: Vector2;
    private readonly secondPoint: Vector2;
    private height: number = 0.0;
    private elevation: number = 0.0;

    public constructor(firstPoint: Vector2, secondPoint: Vector2) {
        this.firstPoint = firstPoint.clone();
        this.secondPoint = secondPoint.clone();
    }

    public withHeight(height: number): PathPropsBuilder {
        this.height = height;
        return this;
    }

    public withElevation(elevation: number): PathPropsBuilder {
        this.elevation = elevation;
        return this;
    }

    public build(): PathProps {
        const upVector = ArrangerMath.perpendicularToVectorFrom(this.firstPoint, this.secondPoint).normalize();

        const elevation = upVector.clone().multiplyScalar(this.elevation);
        this.firstPoint.add(elevation);
        this.secondPoint.add(elevation);

        const height = upVector.clone().multiplyScalar(this.height);
        return [
            this.firstPoint.clone(),
            this.firstPoint.clone().add(height),
            this.secondPoint.clone().add(height),
            this.secondPoint.clone(),
            this.firstPoint.clone(),
        ];
    }
}
