import {ObjectProps} from "../objects/ImportedObject";
import React, {useContext, useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {InteriorArrangerContext} from "./InteriorArrangerMainController";
import {ObjectAdder} from "../components/ObjectAdder";
import {PRIMARY_VARIANT, SELECTED_VARIANT, SECONDARY_VARIANT} from "../constants/Types";

type Props = {
    className?: string
    selectDefaultMenu: () => void,
    objectAddedHandler: (index: number) => void,
}

export const AddObjectController: React.FC<Props> = ({selectDefaultMenu, objectAddedHandler}) => {
    const context = useContext(InteriorArrangerContext);
    if (context === undefined) {
        throw new Error("Context in AddObjectController is undefined.");
    }

    const [objectAdder, setObjectAdder] = useState(new ObjectAdder(context.scene, context.placedObjects, context.updatePlacedObjectsToggle));
    const [indexSelection, setIndexSelection] = useState<number | undefined>(undefined);

    useEffect(() => {
        context.changeMenuName("Dodaj obiekt");
    }, [context.changeMenuName]);

    useEffect(() => {
        setObjectAdder(new ObjectAdder(context.scene, context.placedObjects, context.updatePlacedObjectsToggle));
    }, [context.scene, context.placedObjects, context.updatePlacedObjectsToggle]);

    const selectObject = (index: number) => {
        const objectProps = context.objectDefinitions.at(index);
        if (!objectProps) {
            throw new Error(`Selected invalid index: ${index} from objectDefinitions: ${JSON.stringify(objectProps)}`);
        }
        const indexOfAddedObject = objectAdder.add(objectProps);
        objectAddedHandler(indexOfAddedObject);
    };

    return (
        <>
            <div className="side-by-side-parent">
                <Button onClick={selectDefaultMenu} variant={PRIMARY_VARIANT} className="side-by-side-child btn-sm">
                    Powrót
                </Button>
            </div>
            <SelectObjects
                objects={context.objectDefinitions}
                objectIndex={indexSelection}
                handleIndexSelection={selectObject}
            />
        </>
    );
};

type SelectObjectProps = {
    objects: Array<ObjectProps> | null,
    objectIndex: number | undefined,
    handleIndexSelection: (index: number) => void,
}

const SelectObjects = ({
                           objects,
                           objectIndex,
                           handleIndexSelection,
                       }: SelectObjectProps) => {
    if (!objects) {
        return null;
    }

    return (
        <div>
            {objects.map((object, index) => {
                    let buttonVariant = SECONDARY_VARIANT;
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
