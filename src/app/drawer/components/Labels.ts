import {ComponentProps} from "../objects/component/WallComponent";
import {convertFromAppUnitsToCm} from "./DisplayPrecision";

export const createComponentPropsLabel = (props: ComponentProps, hiddenProps: Array<keyof ComponentProps>) => {
    const parentDiv = document.createElement("div");
    parentDiv.className = "planner-label";

    const nameDiv = document.createElement("div");
    nameDiv.textContent = props.name;
    parentDiv.appendChild(nameDiv);

    if (!hiddenProps.includes("width")) {
        const widthDiv = document.createElement("div");
        widthDiv.textContent = "Szerokość: " + convertFromAppUnitsToCm(props.width);
        parentDiv.appendChild(widthDiv);
    }

    if (!hiddenProps.includes("height")) {
        const heightDiv = document.createElement("div");
        heightDiv.textContent = "Wysokość: " + convertFromAppUnitsToCm(props.height);
        parentDiv.appendChild(heightDiv);
    }

    if (!hiddenProps.includes("elevation")) {
        const elevationDiv = document.createElement("div");
        elevationDiv.textContent = "Wzniesienie: " + convertFromAppUnitsToCm(props.elevation);
        parentDiv.appendChild(elevationDiv);
    }

    return parentDiv;
};

export const createWallConstructionLabel = (width: number) => {
    const div = document.createElement("div");
    div.className = "planner-label";
    div.textContent = "Długość: " + convertFromAppUnitsToCm(width);
    return div;
};
