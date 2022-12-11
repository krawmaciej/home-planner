import React, {useEffect, useLayoutEffect, useState} from "react";
import {Button, Dropdown, Form} from "react-bootstrap";
import {SECONDARY_VARIANT} from "../constants/Types";
import {ChromePicker} from "react-color";
import {LoadedTexture} from "../../common/models/TextureDefinition";
import {RADIAN_MULTIPLIER} from "../../common/components/CommonMathOperations";
import {ObjectWithEditableTexture} from "../objects/ArrangerObject";
import {disposeTexture, setTexture} from "../../common/components/TextureOperations";

type Props = {
    editableObject: ObjectWithEditableTexture,
    texturePromises: Array<LoadedTexture>,
}

type HighlightToggle = {
    highlighted: boolean,
    originalEmissive: number,
}

export const AppearanceEditController: React.FC<Props> = ({ editableObject, texturePromises }) => {
    const [highlightToggle, setHighlightToggle] = useState<HighlightToggle>({
        highlighted: true,
        originalEmissive: editableObject.object3d.material.emissive.getHex(),
    });
    const [color, setColor] = useState("#" + editableObject.object3d.material.color.getHexString());
    const [textureIndex, setTextureIndex] = useState<number>();
    const [textureRotation, setTextureRotation] = useState(editableObject.textureProps.rotation);

    const toggleHighlighted = () => {
        setHighlightToggle(prev => ({
                ...prev,
                highlighted: !prev.highlighted,
        }));
    };

    useEffect(() => {
        if (highlightToggle.highlighted) {
            editableObject.object3d.material.emissive.setHex(0x777777);
        } else {
            editableObject.object3d.material.emissive.setHex(highlightToggle.originalEmissive);
        }
    }, [highlightToggle]);

    useLayoutEffect(() => {
        return () => {
            editableObject.object3d.material.emissive.setHex(highlightToggle.originalEmissive);
        };
    }, [editableObject]);

    useEffect(() => {
        editableObject.object3d.material.color.set(color);
    }, [color]);

    useEffect(() => {
        editableObject.textureProps.rotation = textureRotation;
        const objectTexture = editableObject.object3d.material.map;
        if (objectTexture !== null) {
            objectTexture.rotation = editableObject.initialTextureRotation + (textureRotation * RADIAN_MULTIPLIER);
        }
    }, [textureRotation]);

    useEffect(() => {
        if (textureIndex !== undefined) {
            editableObject.textureProps.fileIndex = textureIndex;
            const texture = texturePromises.at(textureIndex);
            if (texture === undefined) {
                throw new Error(`Selected texture index in AppearanceEditController: ${textureIndex}
                    from textures ${JSON.stringify(texturePromises)}`);
            }
            setTexture(texture, editableObject.object3d.material, editableObject.initialTextureRotation, textureRotation);
        }

        }, [textureIndex]);


    const unsetTexture = () => {
        editableObject.textureProps.fileIndex = undefined;
        disposeTexture(editableObject.object3d.material);
        editableObject.object3d.material.map = null;
        editableObject.object3d.material.needsUpdate = true;
        setTextureIndex(undefined);
    };

    const buttonText = highlightToggle.highlighted ? "Disable highlighting" : "Enable highlighting";

    return (
        <div className="side-by-side-parent">
            <Button onClick={toggleHighlighted} variant={SECONDARY_VARIANT} className="side-by-side-child btn-sm">
                {buttonText}
            </Button>
            <Dropdown drop="up" className="side-by-side-child-only-flex">
                <Dropdown.Toggle variant={SECONDARY_VARIANT} className="side-by-side-child btn-sm">Select color</Dropdown.Toggle>
                <Dropdown.Menu>
                    <ChromePicker color={color} onChange={value => setColor(value.hex)}/>
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown drop="up" className="side-by-side-child-only-flex">
                <Dropdown.Toggle variant={SECONDARY_VARIANT} className="side-by-side-child btn-sm">Select texture</Dropdown.Toggle>
                <Dropdown.Menu>
                    <TextureList
                        setTextureIndex={setTextureIndex}
                        texturePromises={texturePromises}
                        unsetTexture={unsetTexture}
                    />
                </Dropdown.Menu>
            </Dropdown>
            <TextureRotation currentRotation={textureRotation} setRotation={setTextureRotation}/>
        </div>
    );
};

type TextureListProps = {
    setTextureIndex: (value: number) => void,
    texturePromises: Array<LoadedTexture>,
    unsetTexture: () => void,
}

export const TextureList: React.FC<TextureListProps> = ({setTextureIndex, texturePromises, unsetTexture }) => {

    return (
        <div>
            <Button
                onClick={unsetTexture}
                variant={SECONDARY_VARIANT}
                className="btn-sm small"
            >
                Disable texture
            </Button>
            {texturePromises.map((loadedTexture, index) => {
                    return (
                        <Button
                            key={index}
                            onClick={() => setTextureIndex(index)}
                            variant={SECONDARY_VARIANT}
                            className="btn-sm small"
                        >
                            <img src={loadedTexture.url} alt={index.toString()} height="100px"/>
                        </Button>
                    );
                }
            )}
        </div>
    );
};

type TextureRotationProps = {
    currentRotation: number,
    setRotation: (value: number) => void,
}

export const TextureRotation: React.FC<TextureRotationProps> = ({ currentRotation, setRotation }) => {
    const MIN_ALLOWED_ROTATION = 0;
    const MAX_ALLOWED_ROTATION = 360;

    const changeRotation = (value: string) => {
        const passedNumber = Number(value);
        if (!isNaN(passedNumber)) {
            if (passedNumber > MAX_ALLOWED_ROTATION) {
                setRotation(MAX_ALLOWED_ROTATION);
            } else if (passedNumber < MIN_ALLOWED_ROTATION) {
                setRotation(MIN_ALLOWED_ROTATION);
            } else {
                setRotation(passedNumber);
            }
        }
    };

    return (
        <Form.Group>
            <Form.Label size="sm" className="small">
                Texture rotation °
            </Form.Label>
            <Form.Control size="sm" type="text" onChange={event => changeRotation(event.target.value)} value={currentRotation}/>
        </Form.Group>
    );
};
