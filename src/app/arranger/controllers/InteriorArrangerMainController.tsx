import React, {useState} from "react";
import {Object3D, Scene} from "three";
import {MainInputHandler} from "../../common/canvas/inputHandler/MainInputHandler";
import {ObjectProps} from "../objects/ImportedObject";
import {Button} from "react-bootstrap";

const DEFAULT_VARIANT = "dark";
const SELECTED_VARIANT = "light";

type Props = {
    className?: string
    scene: Scene,
    mainInputHandler: MainInputHandler,
    objectDefinitions: Array<ObjectProps>,
    placedObjects: Array<Object3D>,
}

export const InteriorArrangerMainController: React.FC<Props> = ({scene, mainInputHandler, objectDefinitions, placedObjects}: Props) => {

    const [indexSelection, setIndexSelection] = useState<number | undefined>(undefined);

    return (
        <>
            <SelectObjects
                objects={objectDefinitions}
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
