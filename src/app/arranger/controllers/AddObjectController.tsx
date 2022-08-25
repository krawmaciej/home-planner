import {ObjectProps} from "../objects/ImportedObject";
import React, {useContext, useState} from "react";
import {Button} from "react-bootstrap";
import {InteriorArrangerContext} from "./InteriorArrangerMainController";

const DEFAULT_VARIANT = "dark";
const SELECTED_VARIANT = "light";

type Props = {
    className?: string
    selectDefaultMenu: () => void,
}

export const AddObjectController: React.FC<Props> = ({selectDefaultMenu}) => {

    const context = useContext(InteriorArrangerContext);
    if (context === undefined) {
        throw new Error("Context in AddObjectController is undefined.");
    }

    const [indexSelection, setIndexSelection] = useState<number | undefined>(undefined);

    return (
        <>
            <Button onClick={selectDefaultMenu} variant={DEFAULT_VARIANT}>
                Powrót
            </Button>
            <SelectObjects
                objects={context.objectDefinitions}
                objectIndex={indexSelection}
                handleIndexSelection={setIndexSelection}
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
