import React, {useContext, useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {InteriorArrangerContext} from "./InteriorArrangerMainController";
import {Object3D} from "three";

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

    useEffect(() => {
        context.changeMenuName("Przesuń/Obróć obiekt");
    }, [context.changeMenuName]);

    const [indexSelection, setIndexSelection] = useState<number | undefined>(undefined);

    useEffect(() => {
        setIndexSelection(initialSelectedIndex);
    }, [initialSelectedIndex]);

    const selectObject = (index: number) => {
        const placedObject = context.placedObjects.at(index);
        if (!placedObject) {
            throw new Error(`Selected invalid index: ${index} from placedObjects: ${JSON.stringify(placedObject)}`);
        }
        setIndexSelection(index);
    };

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
        </>
    );
};

type SelectObjectProps = {
    placedObjects: Array<Object3D<any>>,
    objectIndex: number | undefined,
    handleIndexSelection: (index: number) => void,
}

const SelectObjects = ({
                           placedObjects,
                           objectIndex,
                           handleIndexSelection,
                       }: SelectObjectProps) => {
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
                            {object.id}
                        </Button>
                    );
                }
            )}
        </div>
    );
};
