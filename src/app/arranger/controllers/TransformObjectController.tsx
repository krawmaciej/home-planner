import {ObjectProps} from "../objects/ImportedObject";
import React, {useContext, useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {InteriorArrangerContext} from "./InteriorArrangerMainController";
import {ObjectAdder} from "../components/ObjectAdder";

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
        throw new Error("Context in AddObjectController is undefined.");
    }

    useEffect(() => {
        context.changeMenuName("Przesuń/Obróć obiekt");
    }, [context.changeMenuName]);

    const [objectAdder, setObjectAdder] = useState(new ObjectAdder(context.scene, context.placedObjects));
    const [indexSelection, setIndexSelection] = useState<number | undefined>(undefined);

    useEffect(() => {
        setIndexSelection(indexSelection);
    }, [initialSelectedIndex]);

    useEffect(() => {
        setObjectAdder(new ObjectAdder(context.scene, context.placedObjects));
    }, [context.scene, context.placedObjects]);

    const selectObject = (index: number) => {
        const objectProps = context.objectDefinitions.at(index);
        if (!objectProps) {
            throw new Error(`Selected invalid index: ${index} from objectDefinitions: ${JSON.stringify(objectProps)}`);
        }
        objectAdder.add(objectProps.object3d);
        setIndexSelection(index);
    };

    return (
        <>
            <Button onClick={selectDefaultMenu} variant={DEFAULT_VARIANT}>
                Powrót
            </Button>
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
