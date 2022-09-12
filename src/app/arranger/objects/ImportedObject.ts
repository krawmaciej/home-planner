import {ArrangerObject} from "./ArrangerObject";

export type ObjectProps = ArrangerObject & {
    readonly name: string,
    readonly thumbnail: string,
    readonly width: number,
    readonly thickness: number,
    readonly height: number,
}
