import React, {useContext, useEffect, useState} from "react";
import {FloorPlanContext} from "./FloorPlanMainController";
import {WallComponentMenu} from "./WallComponentController";
import {RemoveObjectIH} from "../IO/inputHandlers/RemoveObjectIH";
import {Button} from "react-bootstrap";
import {PRIMARY_VARIANT} from "../../arranger/constants/Types";

type RemoveWallComponentProps = {
    goBack: () => void,
}

export const RemoveWallComponentController: React.FC<RemoveWallComponentProps> = ({ goBack }) => {
    const context = useContext(FloorPlanContext);
    if (context === undefined) {
        throw new Error("Context in RemoveWallComponentController is undefined.");
    }

    useEffect(() => {
        context.changeMenuName(WallComponentMenu.DELETE);
    }, [context.changeMenuName]);


    const [inputHandler, setInputHandler] = useState(new RemoveObjectIH(context.wallComponentRemover));

    useEffect(() => {
        context.mainInputHandler.changeHandlingStrategy(inputHandler);
    }, [inputHandler]);

    useEffect(() => {
        setInputHandler(new RemoveObjectIH(context.wallComponentRemover));
    }, [context.wallComponentRemover]);

    useEffect(() => () => {
        context.mainInputHandler.detachCurrentHandler();
    }, [context.mainInputHandler]);

    return (
        <div className="side-by-side-parent">
            <Button onClick={goBack} variant={PRIMARY_VARIANT}
                    className="side-by-side-child btn-sm">
                Powrót
            </Button>
        </div>
    );
};
