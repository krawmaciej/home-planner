import {ComponentProps} from "../objects/component/WallComponent";
import {convertFromAppUnitsToCm, convertFromAppUnitsToM} from "./DisplayPrecision";
import {Vector3} from "three";

export const createComponentPropsLabel = (props: ComponentProps, hiddenProps: Array<keyof ComponentProps>) => {
    const parentDiv = document.createElement("div");
    parentDiv.className = "planner-label";

    const nameDiv = document.createElement("div");
    nameDiv.textContent = props.name;
    parentDiv.appendChild(nameDiv);

    if (!hiddenProps.includes("width")) {
        const widthDiv = document.createElement("div");
        widthDiv.textContent = "Width: " + convertFromAppUnitsToCm(props.width);
        parentDiv.appendChild(widthDiv);
    }

    if (!hiddenProps.includes("height")) {
        const heightDiv = document.createElement("div");
        heightDiv.textContent = "Height: " + convertFromAppUnitsToCm(props.height);
        parentDiv.appendChild(heightDiv);
    }

    if (!hiddenProps.includes("elevation")) {
        const elevationDiv = document.createElement("div");
        elevationDiv.textContent = "Elevation: " + convertFromAppUnitsToCm(props.elevation);
        parentDiv.appendChild(elevationDiv);
    }

    return parentDiv;
};

export const createWallConstructionLabel = (width: number) => {
    const div = document.createElement("div");
    div.className = "planner-label";
    div.textContent = "Length: " + convertFromAppUnitsToM(width);
    return div;
};

export const createFloorCeilingSquareFootageText = (first: Vector3, last: Vector3): string => {
    const distance = first.clone().sub(last);
    const squareFootage = Math.abs(distance.x * distance.z) / 10;
    return "Surface area: " + convertFromAppUnitsToM(squareFootage) + "2";
};

export const createFloorCeilingEmptyLabel = () => {
    const div = document.createElement("div");
    div.className = "planner-label";
    div.textContent = "";
    return div;
};

export const createConvertedArrangerObjectLabel = (name: string) => {
    const div = document.createElement("div");
    div.className = "planner-label";
    div.textContent = name;
    return div;
};
