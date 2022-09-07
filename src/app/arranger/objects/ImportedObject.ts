import {ArrangerObject} from "./ArrangerObject";

export type ObjectProps = ArrangerObject & {
    readonly name: string,
    readonly thumbnail: string,
}
