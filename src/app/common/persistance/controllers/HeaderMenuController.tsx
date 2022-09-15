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
            <DropdownButton title="Plik" className="persistence-button btn-sm small" variant="secondary" size="sm">
                <Dropdown.Item onClick={props.openFile}>Otwórz projekt</Dropdown.Item>
                <Dropdown.Item onClick={props.saveFile}>Zapisz projekt</Dropdown.Item>
                <Dropdown.Divider/>
                <Dropdown.Item onClick={props.saveRender}>Eksportuj widok do pliku</Dropdown.Item>
            </DropdownButton>
            <DropdownButton title="Widok" className="persistence-button btn-sm small" variant="secondary" size="sm">
                <Dropdown.Item onClick={props.choosePlanDrawer}>Rysunek planu 2D</Dropdown.Item>
                <Dropdown.Item onClick={props.chooseInteriorArranger}>Rzut 3D</Dropdown.Item>
                <Dropdown.Divider/>
                <Dropdown.Item onClick={props.resetCamera}>Resetuj kamerę</Dropdown.Item>
            </DropdownButton>
        </div>
    );
};
