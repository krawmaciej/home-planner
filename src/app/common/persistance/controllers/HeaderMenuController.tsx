import React from "react";
import {Dropdown, DropdownButton} from "react-bootstrap";

type Props = {
    className?: string,
    openFile: () => void,
    saveFile: () => void,
    saveRender: () => void,
    chooseInteriorArranger: () => void,
    choosePlanDrawer: () => void,
    resetCamera: () => void,
}

export const HeaderMenuController: React.FC<Props> = (props: Props) => {

    return (
        <div className={props.className}>
            <DropdownButton title="File" className="persistence-button btn-sm small" variant="secondary" size="sm">
                <Dropdown.Item onClick={props.openFile}>Open project</Dropdown.Item>
                <Dropdown.Item onClick={props.saveFile}>Save project</Dropdown.Item>
                <Dropdown.Divider/>
                <Dropdown.Item onClick={props.saveRender}>Export current view to file</Dropdown.Item>
            </DropdownButton>
            <DropdownButton title="View" className="persistence-button btn-sm small" variant="secondary" size="sm">
                <Dropdown.Item onClick={props.choosePlanDrawer}>2D View</Dropdown.Item>
                <Dropdown.Item onClick={props.chooseInteriorArranger}>3D View</Dropdown.Item>
                <Dropdown.Divider/>
                <Dropdown.Item onClick={props.resetCamera}>Reset camera</Dropdown.Item>
            </DropdownButton>
        </div>
    );
};
