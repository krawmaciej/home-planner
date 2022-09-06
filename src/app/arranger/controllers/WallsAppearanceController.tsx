import React, {useContext, useEffect, useState} from "react";
import {InteriorArrangerContext} from "./InteriorArrangerMainController";
import {Button} from "react-bootstrap";
import {PRIMARY_VARIANT} from "../constants/Types";
import {SelectObjectIH} from "../IO/inputHandlers/SelectObjectIH";
import {AppearanceEditController} from "./AppearanceEditController";

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

    const getWallFace = (index: number) => {
        const wallFace = context.convertedObjects.wallFaces.at(index);
        if (wallFace === undefined) {
            throw new Error(`Selected invalid index: ${index} from wallFaces.`);
        }
        return wallFace;
    };

    const selectWallFace = (index: number) => {
        setWallFaceIndex(index);
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

    let cancelButton = null;
    let appearanceEdit = null;
    if (wallFaceIndex !== undefined) {
        cancelButton = (
            <Button
                onClick={() => setWallFaceIndex(undefined)}
                variant={PRIMARY_VARIANT}
                className="side-by-side-child btn-sm"
            >
                Anuluj
            </Button>
        );
        appearanceEdit = (
            <AppearanceEditController
                convertedObject={getWallFace(wallFaceIndex)}
                texturePromises={context.textures}
            />
        );
    }

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
                {cancelButton}
            </div>
            {appearanceEdit}
        </>
    );
};
