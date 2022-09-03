import React, {useContext, useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {InteriorArrangerContext} from "./InteriorArrangerMainController";
import {ObjectProps} from "../objects/ImportedObject";
import {ObjectTransformer} from "../components/ObjectTransformer";

const DEFAULT_VARIANT = "dark";
const SELECTED_VARIANT = "light";

type Props = {
    className?: string
    selectDefaultMenu: () => void,
    initialSelectedIndex?: number,
}

export const TransformObjectController: React.FC<Props> = ({selectDefaultMenu, initialSelectedIndex}) => {
    const context = useContext(InteriorArrangerContext);
    if (context === undefined) {
        throw new Error("Context in TransformObjectController is undefined.");
    }

    const [objectTransformer, setObjectTransformer] = useState(new ObjectTransformer(context.scene, context.interiorArrangerState));
    const [indexSelection, setIndexSelection] = useState<number | undefined>(undefined);

    useEffect(() => {
        context.changeMenuName("Edytuj dodane obiekty");
    }, [context.changeMenuName]);

    useEffect(() => {
        context.interiorArrangerState.transformControls.setMode("translate");
        setObjectTransformer(new ObjectTransformer(context.scene, context.interiorArrangerState));
        return () => {
            objectTransformer.stopTransforming();
        };
    }, [context.scene, context.interiorArrangerState]);

    const selectObject = (index: number) => {
        const placedObject = context.placedObjects.at(index);
        if (!placedObject) {
            throw new Error(`Selected invalid index: ${index} from placedObjects: ${JSON.stringify(placedObject)}`);
        }
        setIndexSelection(index);
        objectTransformer.startTransforming(placedObject);
    };

    useEffect(() => {
        if (initialSelectedIndex !== undefined) {
            selectObject(initialSelectedIndex);
        }
    }, [initialSelectedIndex]);

    return (
        <>
            <Button onClick={selectDefaultMenu} variant={DEFAULT_VARIANT}>
                Powrót
            </Button>
            <SelectObjects
                placedObjects={context.placedObjects}
                objectIndex={indexSelection}
                handleIndexSelection={selectObject}
            />
            <TransformMode
                objectTransformer={objectTransformer}
            />
        </>
    );
};

type SelectObjectProps = {
    placedObjects: Array<ObjectProps>,
    objectIndex: number | undefined,
    handleIndexSelection: (index: number) => void,
}

const SelectObjects: React.FC<SelectObjectProps> = ({
                           placedObjects,
                           objectIndex,
                           handleIndexSelection,
}) => {
    if (placedObjects.length === 0) {
        return (<p>Brak obiektów do edycji, dodaj obiekt.</p>);
    }

    return (
        <div>
            {placedObjects.map((object, index) => {
                    let buttonVariant = DEFAULT_VARIANT;
                    if (objectIndex === index) {
                        buttonVariant = SELECTED_VARIANT;
                    }
                    return (
                        <Button
                            key={index}
                            onClick={() => handleIndexSelection(index)}
                            variant={buttonVariant}
                            className="btn-sm small"
                        >
                            {object.name}
                        </Button>
                    );
                }
            )}
        </div>
    );
};

type TransformModeProps = {
    objectTransformer: ObjectTransformer,
}

const TransformMode: React.FC<TransformModeProps> = ({ objectTransformer }) => {
    if (!objectTransformer.isTransforming()) {
        return null;
    }
    return (
        <>
            <Button onClick={() => objectTransformer.setToTranslateMode()}>
                Przesuwanie
            </Button>
            <Button onClick={() => objectTransformer.setToRotateMode()}>
                Obracanie
            </Button>
            <Button onClick={() => objectTransformer.resetTranslate()}>
                Resetuj pozycje do początkowej
            </Button>
            <Button onClick={() => objectTransformer.resetRotation()}>
                Resetuj rotacje do początkowej
            </Button>
        </>
    );
};
