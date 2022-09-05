import React, {useEffect, useState} from "react";
import {WallFaceMesh} from "../objects/WallFaceMesh";
import {Button, DropdownButton} from "react-bootstrap";
import {ChromePicker} from "react-color";

type Props = {
    convertedObject: WallFaceMesh | undefined,
}

type HighlightToggle = {
    highlighted: boolean,
    originalEmissive: number,
}

export const AppearanceEditController: React.FC<Props> = ({ convertedObject }) => {
    if (convertedObject === undefined) {
        return null;
    }

    const [highlightToggle, setHighlightToggle] = useState<HighlightToggle>({
        highlighted: true,
        originalEmissive: convertedObject.object3d.material.emissive.getHex(),
    });
    const [color, setColor] = useState("#" + convertedObject.object3d.material.color.getHexString());

    const toggleHighlighted = () => {
        setHighlightToggle(prev => ({
                ...prev,
                highlighted: !prev.highlighted,
        }));
    };

    useEffect(() => {
        if (highlightToggle.highlighted) {
            convertedObject.object3d.material.emissive.setHex(0x777777);
        } else {
            convertedObject.object3d.material.emissive.setHex(highlightToggle.originalEmissive);
        }
    }, [highlightToggle]);

    useEffect(() => {
        return () => {
            convertedObject.object3d.material.emissive.setHex(highlightToggle.originalEmissive);
        };
    }, [convertedObject]);

    useEffect(() => {
        convertedObject.object3d.material.color.set(color);
    }, [color]);

    const buttonText = highlightToggle.highlighted ? "Wyłącz podświetlenie obiektu" : "Włącz podświetlenie obiektu";

    return (
        <>
            <Button onClick={toggleHighlighted}>
                {buttonText}
            </Button>
            <DropdownButton title="Wybór koloru" drop="up">
                <ChromePicker color={color} onChange={value => setColor(value.hex)}/>
            </DropdownButton>
        </>
    );
};
