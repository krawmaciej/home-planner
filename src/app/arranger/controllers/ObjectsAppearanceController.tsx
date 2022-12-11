import React, {useContext, useEffect, useState} from "react";
import {InteriorArrangerContext} from "./InteriorArrangerMainController";
import {Button} from "react-bootstrap";
import {PRIMARY_VARIANT} from "../constants/Types";
import {SelectObjectIH} from "../IO/inputHandlers/SelectObjectIH";
import {AppearanceEditController} from "./AppearanceEditController";
import {ObjectWithEditableTexture} from "../objects/ArrangerObject";

type Texts = {
    controllerName: string,
    unselectText: string,
}

type Props = {
    selectDefaultMenu: () => void,
    texts: Texts,
    editableObjects: Array<ObjectWithEditableTexture>,
}

export const ObjectsAppearanceController: React.FC<Props> = ({ selectDefaultMenu, texts, editableObjects }) => {
    const context = useContext(InteriorArrangerContext);
    if (context === undefined) {
        throw new Error(`Context in AppearanceController named: ${texts.controllerName} is undefined.`);
    }

    useEffect(() => {
        context.changeMenuName(texts.controllerName);
    }, [context.changeMenuName]);

    const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

    const getEditableObject = (index: number) => {
        const editableObject = editableObjects.at(index);
        if (editableObject === undefined) {
            throw new Error(`Selected invalid index: ${index} from objects ${JSON.stringify(editableObject)}.`);
        }
        return editableObject;
    };

    const selectEditableObject = (index: number) => {
        setSelectedIndex(index);
    };

    useEffect(() => {
        const selectObjectIH = new SelectObjectIH(
            context.interiorArrangerState.cameraHandler.getCamera(),
            editableObjects,
            selectEditableObject,
        );
        context.canvasState.mainInputHandler.changeHandlingStrategy(selectObjectIH);

        return () => {
            context.canvasState.mainInputHandler.detachCurrentHandler();
        };
    }, [context.interiorArrangerState, editableObjects, context.canvasState]);

    let unselectButton = null;
    let appearanceEdit = null;
    if (selectedIndex !== undefined) {
        unselectButton = (
            <Button
                onClick={() => setSelectedIndex(undefined)}
                variant={PRIMARY_VARIANT}
                className="side-by-side-child btn-sm"
            >
                {texts.unselectText}
            </Button>
        );
        appearanceEdit = (
            <AppearanceEditController
                editableObject={getEditableObject(selectedIndex)}
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
                    Back
                </Button>
                {unselectButton}
            </div>
            {appearanceEdit}
        </>
    );
};
