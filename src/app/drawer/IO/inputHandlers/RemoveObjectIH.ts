import {IInputHandler} from "../../../common/canvas/inputHandler/IInputHandler";
import {InputPoint} from "../../../common/canvas/inputHandler/MainInputHandler";
import {IObjectRemover} from "../../components/IObjectRemover";

export class RemoveObjectIH implements IInputHandler {

    private readonly objectRemover: IObjectRemover;

    public constructor(objectRemover: IObjectRemover) {
        this.objectRemover = objectRemover;
    }

    public handleCancel(): void {
        // no op
    }

    public handleClick({ unprojected }: InputPoint): void {
        this.objectRemover.removeAt(unprojected);
    }

    public handleMovement({ unprojected }: InputPoint): void {
        this.objectRemover.selectAt(unprojected);
    }
}
