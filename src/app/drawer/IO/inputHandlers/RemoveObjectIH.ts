import {IInputHandler} from "../../../common/canvas/inputHandler/IInputHandler";
import {InputPoint} from "../../../common/canvas/inputHandler/MainInputHandler";
import {IObjectRemover} from "../../components/IObjectRemover";

export class RemoveObjectIH implements IInputHandler {

    private readonly floorsRemover: IObjectRemover;

    public constructor(floorsRemover: IObjectRemover) {
        this.floorsRemover = floorsRemover;

    }

    public handleCancel(): void {
        // no op
    }

    public handleClick({ unprojected }: InputPoint): void {
        this.floorsRemover.removeAt(unprojected);
    }

    public handleMovement({ unprojected }: InputPoint): void {
        this.floorsRemover.selectAt(unprojected);
    }
}
