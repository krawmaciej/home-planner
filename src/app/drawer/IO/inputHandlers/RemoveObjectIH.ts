import {IInputHandler} from "../../../common/canvas/inputHandler/IInputHandler";
import {InputPoint} from "../../../common/canvas/inputHandler/MainInputHandler";
import {FloorsRemover} from "../../components/floor/FloorsRemover";

export class RemoveObjectIH implements IInputHandler {

    private readonly floorsRemover: FloorsRemover;

    public constructor(floorsRemover: FloorsRemover) {
        this.floorsRemover = floorsRemover;

    }

    public handleCancel(): void {
        // no op
    }

    public handleClick({ unprojected }: InputPoint): void {
        this.floorsRemover.removeObjectAt(unprojected);
    }

    public handleMovement({ unprojected }: InputPoint): void {
        this.floorsRemover.selectObjectAt(unprojected);
    }
}
