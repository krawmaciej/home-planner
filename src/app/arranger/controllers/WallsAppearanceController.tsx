import React, {useContext, useEffect, useState} from "react";
import {InteriorArrangerContext} from "./InteriorArrangerMainController";
import {Button} from "react-bootstrap";
import {PRIMARY_VARIANT} from "../constants/Types";
import {SelectObjectIH} from "../IO/inputHandlers/SelectObjectIH";
import {AppearanceEditController} from "./AppearanceEditController";
import {ConvertedPlanObject} from "../objects/ConvertedPlanObject";
import {WallFaceMesh} from "../objects/WallFaceMesh";

type Props = {
    selectDefaultMenu: () => void,
}

export const WallsAppearanceController: React.FC<Props> = ({ selectDefaultMenu }) => {
    const context = useContext(InteriorArrangerContext);
    if (context === undefined) {
        throw new Error("Context in WallsAppearanceController is undefined.");
    }

    useEffect(() => {
        context.changeMenuName("Edytuj wygląd ścian");
    }, [context.changeMenuName]);

    const [wallFaceIndex, setWallFaceIndex] = useState<number | undefined>();

    let wallFace: WallFaceMesh | undefined;

    const getWallFace = (index: number | undefined) => {
        if (index === undefined) {
            return undefined;
        }
        return context.convertedObjects.wallFaces.at(index);
    };

    const selectWallFace = (index: number) => {
        wallFace = getWallFace(index);
        if (wallFace === undefined) {
            throw new Error(`Selected invalid index: ${index} from wallFaces.`);
        }
        setWallFaceIndex(index);
        console.log("Selected wall face index: ", index);
    };

    useEffect(() => {
        const selectObjectIH = new SelectObjectIH(
            context.interiorArrangerState.cameraHandler.getCamera(),
            context.convertedObjects.wallFaces,
            selectWallFace,
        );
        context.canvasState.mainInputHandler.changeHandlingStrategy(selectObjectIH);

        return () => {
            context.canvasState.mainInputHandler.detachCurrentHandler();
        };
    }, [context.interiorArrangerState, context.convertedObjects, context.canvasState]);

    console.log("object: ", wallFace);
    return (
        <>
            <div className="side-by-side-parent">
                <Button
                    onClick={selectDefaultMenu}
                    variant={PRIMARY_VARIANT}
                    className="side-by-side-child btn-sm"
                >
                    Powrót
                </Button>
            </div>
            <AppearanceEditController
                convertedObject={getWallFace(wallFaceIndex)}
            />
        </>
    );
};
