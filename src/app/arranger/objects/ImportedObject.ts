import {ConvertedPlanObject} from "./ConvertedPlanObject";

export type ObjectProps = ConvertedPlanObject & {
    readonly name: string,
    readonly thumbnail: string,
}
