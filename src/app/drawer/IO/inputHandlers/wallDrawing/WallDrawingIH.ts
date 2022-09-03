import { WallDrawer } from "../../../components/WallDrawer";
import { DrawingState, WallPointer } from "./WallPointer";
import { IInputHandler } from "../../../../common/canvas/inputHandler/IInputHandler";
import {InputPoint} from "../../../../common/canvas/inputHandler/MainInputHandler";

/**
 * Stateful input handler for drawing new walls.
 * Start state is NONE, start point set to 0,0,0.
 */
export class WallDrawingIH implements IInputHandler {

    private readonly wallDrawer: WallDrawer;
    private pointer: WallPointer;

    public constructor(wallDrawer: WallDrawer) {
        this.wallDrawer = wallDrawer;
        this.pointer = new WallPointer();
    }

    public handleMovement({ unprojected }: InputPoint): void {
        this.pointer = this.pointer.changePosition(unprojected);
        this.process();
    }

    public handleClick({ unprojected }: InputPoint): void {
        if (this.pointer.state === DrawingState.NONE) {
            this.pointer = this.pointer.startDrawing(unprojected);
        } else if (this.pointer.state === DrawingState.DRAWING) {
            this.pointer = this.pointer.stopDrawing(unprojected);
        }
        this.process();
    }

    private process(): void {
        // aliases
        const start = this.pointer.startPosition;
        const end = this.pointer.endPosition;

        if (this.pointer.state === DrawingState.NONE) {
            // no op
        } else if (this.pointer.state === DrawingState.DRAWING) {
            // todo: start will be always the same, unprojection can be cached
            this.wallDrawer.moveDrawedWall(start, end);
        } else if (this.pointer.state === DrawingState.DRAW) {
            if (this.wallDrawer.drawWall(start, end)) {
                this.pointer = this.pointer.draw();
            } else {
                this.pointer = this.pointer.startDrawing(start);
            }
        }
    }

    public handleCancel(): void {
        if (this.pointer.state === DrawingState.DRAWING) {
            this.pointer = this.pointer.reset();
            this.wallDrawer.removeDrawnWall();
        }
    }
}
