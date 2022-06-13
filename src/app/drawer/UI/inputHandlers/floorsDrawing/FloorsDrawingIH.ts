import { Vector3 } from "three";
import { WallDrawer } from "../../../components/WallDrawer";
import { DrawingState, FloorsPointer } from "./FloorsPointer";
import { IInputHandler } from "../../../../common/canvas/inputHandler/IInputHandler";

/**
 * Stateful input handler for drawing new floors.
 * Start state is NONE, start point set to 0,0,0.
 */
export class FloorsDrawingIH implements IInputHandler {

    private readonly wallDrawer: WallDrawer;
    private pointer: FloorsPointer;

    public constructor(wallDrawer: WallDrawer) {
        this.wallDrawer = wallDrawer;
        this.pointer = new FloorsPointer();
    }

    public handleMovement(point: Vector3): void {
        this.pointer = this.pointer.changePosition(point);
        this.process();
    }

    public handleClick(point: Vector3): void {
        if (this.pointer.state === DrawingState.NONE) {
            this.pointer = this.pointer.startDrawing(point);
        } else if (this.pointer.state === DrawingState.DRAWING) {
            this.pointer = this.pointer.stopDrawing(point);
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
            this.pointer = this.pointer.draw();
            this.wallDrawer.drawWall(start, end); // todo: return whether it was able to draw the wall, if not then do not set pointer to draw
        }
    }
}
