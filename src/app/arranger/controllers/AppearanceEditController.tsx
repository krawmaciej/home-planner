import React, {useEffect, useLayoutEffect, useState} from "react";
import {WallFaceMesh} from "../objects/WallFaceMesh";
import {Button, Dropdown} from "react-bootstrap";
import {SECONDARY_VARIANT} from "../constants/Types";
import {ChromePicker} from "react-color";

type Props = {
    convertedObject: WallFaceMesh,
}

type HighlightToggle = {
    highlighted: boolean,
    originalEmissive: number,
}

export const AppearanceEditController: React.FC<Props> = ({ convertedObject }) => {
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

    useLayoutEffect(() => {
        return () => {
            console.log("dismount with: ", convertedObject);
            convertedObject.object3d.material.emissive.setHex(highlightToggle.originalEmissive);
        };
    }, [convertedObject]);

    useEffect(() => {
        convertedObject.object3d.material.color.set(color);
    }, [color]);

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
                    Heh
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};
