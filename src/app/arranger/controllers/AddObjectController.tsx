import {ObjectProps} from "../objects/ImportedObject";
import React, {useContext, useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {InteriorArrangerContext} from "./InteriorArrangerMainController";
import {ObjectAdder} from "../components/ObjectAdder";
import {PRIMARY_VARIANT, SELECTED_VARIANT, SECONDARY_VARIANT} from "../constants/Types";
import {convertFromAppUnitsToCm} from "../../drawer/components/DisplayPrecision";

type Props = {
    className?: string
    selectDefaultMenu: () => void,
    addObjectToTransformObjectTransfer: (index: number) => void,
}

export const AddObjectController: React.FC<Props> = ({selectDefaultMenu, addObjectToTransformObjectTransfer}) => {
    const context = useContext(InteriorArrangerContext);
    if (context === undefined) {
        throw new Error("Context in AddObjectController is undefined.");
    }

    const [objectAdder, setObjectAdder] = useState(new ObjectAdder(context.canvasState.scene, context.sceneObjectsState.placedObjects, context.updatePlacedObjectsToggle));
    const [indexSelection] = useState<number | undefined>(undefined);

    useEffect(() => {
        context.changeMenuName("Add 3D Object");
    }, [context.changeMenuName]);

    useEffect(() => {
        setObjectAdder(new ObjectAdder(context.canvasState.scene, context.sceneObjectsState.placedObjects, context.updatePlacedObjectsToggle));
    }, [context.canvasState, context.sceneObjectsState, context.updatePlacedObjectsToggle]);

    const selectObject = (index: number) => {
        const objectProps = context.objectDefinitions.at(index);
        if (!objectProps) {
            throw new Error(`Selected invalid index: ${index} from objectDefinitions: ${JSON.stringify(objectProps)}`);
        }
        const indexOfAddedObject = objectAdder.add(objectProps);
        addObjectToTransformObjectTransfer(indexOfAddedObject);
    };

    return (
        <>
            <div className="side-by-side-parent">
                <Button onClick={selectDefaultMenu} variant={PRIMARY_VARIANT} className="side-by-side-child btn-sm">
                    Back
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
        return null; // it's fine in this component as it's stateless
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
                            <div className="side-by-side-parent">
                                <div className="side-by-side-child">
                                    <div>{object.name}</div>
                                    <div>Length: {convertFromAppUnitsToCm(object.width)}</div>
                                    <div>Width: {convertFromAppUnitsToCm(object.thickness)}</div>
                                    <div>Height: {convertFromAppUnitsToCm(object.height)}</div>
                                </div>
                                <div className="side-by-side-child">
                                    <img src={object.thumbnail} alt={object.name} height="100px"/>
                                </div>
                            </div>
                        </Button>
                    );
                }
            )}
        </div>
    );
};
