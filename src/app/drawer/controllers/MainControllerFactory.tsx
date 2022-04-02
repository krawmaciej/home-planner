import DoorsWindowsController from "./DoorsWindowsController";
import SelectMainController from "./SelectMainController";
import WallController from "./WallController";

export enum MainControllerType {
    WALLS, WINDOWS_AND_DOORS, SELECT
}

export default class MainControllerFactory {

    public static getController(type: MainControllerType) {
        switch (type) {
            case MainControllerType.WALLS: {
                return <WallController/>
            }
            case MainControllerType.WINDOWS_AND_DOORS: {
                return <DoorsWindowsController/>
            }
            case MainControllerType.SELECT: {
                return <SelectMainController/>
            }
            default: {
                throw new Error("Not implemented yet."); // defensive fallback
            }
        }
    }
}
