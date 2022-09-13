import {ArrangerObject} from "./ArrangerObject";

export type ObjectProps = ArrangerObject & {
    readonly name: string,
    readonly thumbnail: string,
    readonly width: number,
    readonly thickness: number,
    readonly height: number,
    // todo: when saving take needed state from object3d's properties, don't save it here
}
