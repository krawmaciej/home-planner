import React, {useEffect, useLayoutEffect, useState} from "react";
import {WallFaceMesh} from "../objects/WallFaceMesh";
import {Button, Dropdown} from "react-bootstrap";
import {SECONDARY_VARIANT} from "../constants/Types";
import {ChromePicker} from "react-color";
import {LoadedTexture} from "../../common/models/TextureDefinition";

type Props = {
    convertedObject: WallFaceMesh,
    texturePromises: Array<LoadedTexture>,
}

type HighlightToggle = {
    highlighted: boolean,
    originalEmissive: number,
}

export const AppearanceEditController: React.FC<Props> = ({ convertedObject, texturePromises }) => {
    const [highlightToggle, setHighlightToggle] = useState<HighlightToggle>({
        highlighted: true,
        originalEmissive: convertedObject.object3d.material.emissive.getHex(),
    });
    const [color, setColor] = useState("#" + convertedObject.object3d.material.color.getHexString());
    const [textureIndex, setTextureIndex] = useState<number>();

    const toggleHighlighted = () => {
        setHighlightToggle(prev => ({
                ...prev,
                highlighted: !prev.highlighted,
        }));
    };

    const disposeLastTexture = () => {
        if (convertedObject.object3d.material.map !== null) {
            convertedObject.object3d.material.map.dispose();
        }
    };

    useEffect(() => {
        if (highlightToggle.highlighted) {
            convertedObject.object3d.material.emissive.setHex(0x777777);
        } else {
            convertedObject.object3d.material.emissive.setHex(highlightToggle.originalEmissive);
        }
    }, [highlightToggle]);

    useLayoutEffect(() => {
        return () => {
            convertedObject.object3d.material.emissive.setHex(highlightToggle.originalEmissive);
        };
    }, [convertedObject]);

    useEffect(() => {
        convertedObject.object3d.material.color.set(color);
    }, [color]);

    useEffect(() => {
        if (textureIndex !== undefined) {
            const texture = texturePromises.at(textureIndex);
            if (texture === undefined) {
                throw new Error(`Selected texture index: ${textureIndex} from textures ${JSON.stringify(texturePromises)}`);
            }

            disposeLastTexture();

            texture.texture.then(txt => {
                const clonedTexture = txt.clone();
                clonedTexture.needsUpdate = true;
                clonedTexture.rotation = convertedObject.textureRotation;
                convertedObject.object3d.material.map = clonedTexture;
                convertedObject.object3d.material.needsUpdate = true;
            });
        }
    }, [textureIndex]);


    const unsetTexture = () => {
        disposeLastTexture();
        convertedObject.object3d.material.map = null;
        convertedObject.object3d.material.needsUpdate = true;
        setTextureIndex(undefined);
    };

    const buttonText = highlightToggle.highlighted ? "Wyłącz podświetlenie obiektu" : "Włącz podświetlenie obiektu";

    return (
        <div className="side-by-side-parent">
            <Button onClick={toggleHighlighted} variant={SECONDARY_VARIANT} className="side-by-side-child btn-sm">
                {buttonText}
            </Button>
            <Dropdown drop="up" className="side-by-side-child-only-flex">
                <Dropdown.Toggle variant={SECONDARY_VARIANT} className="side-by-side-child btn-sm">Wybierz kolor</Dropdown.Toggle>
                <Dropdown.Menu>
                    <ChromePicker color={color} onChange={value => setColor(value.hex)}/>
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown drop="up" className="side-by-side-child-only-flex">
                <Dropdown.Toggle variant={SECONDARY_VARIANT} className="side-by-side-child btn-sm">Wybierz teksturę</Dropdown.Toggle>
                <Dropdown.Menu>
                    <TextureList
                        setTextureIndex={setTextureIndex}
                        texturePromises={texturePromises}
                        unsetTexture={unsetTexture}
                    />
                </Dropdown.Menu>
            </Dropdown>
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
                Wyłącz teksturę
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
