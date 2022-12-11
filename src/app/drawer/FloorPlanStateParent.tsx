import "../css/MainStyle.css";

import React, {useEffect, useState} from 'react';

import {FloorPlanMainController} from "./controllers/FloorPlanMainController";
import {SceneObjectsState} from "../common/context/SceneObjectsDefaults";
import {ComponentProps} from "./objects/component/WallComponent";
import {disposeSceneObjects} from "../common/context/SceneOperations";
import {CanvasState} from "../common/context/CanvasDefaults";
import {WallThickness} from "./objects/wall/WallThickness";
import {WebGLRenderer} from "three";
import {ICameraHandler} from "../common/canvas/ICameraHandler";
import {addCurrentSceneObjects} from "./components/CurrentSceneObjectsAdder";
import {FloorPlanState} from "../../App";
import {convertArrangerToPlan} from "./components/converter/ArrangerToPlanConverter";
import {DEFAULT_WALL_HEIGHT} from "./constants/Types";
import {Button, Form} from "react-bootstrap";
import {PRIMARY_VARIANT} from "../arranger/constants/Types";

type Props = {
    className?: string,
    renderer: WebGLRenderer,
    sceneObjects: SceneObjectsState,
    doorDefinitions: Array<ComponentProps>,
    windowDefinitions: Array<ComponentProps>,
    canvasState: CanvasState,
    cameraHandler: ICameraHandler,
    floorPlanState: FloorPlanState,
}

export const FloorPlanStateParent: React.FC<Props> = ({
                                                          sceneObjects,
                                                          doorDefinitions,
                                                          windowDefinitions,
                                                          canvasState,
                                                          renderer,
}) => {
    const [wallThickness] = useState(new WallThickness(1.0));

    useEffect(() => {
        const converted = convertArrangerToPlan(sceneObjects);
        addCurrentSceneObjects([
            ...sceneObjects.floors,
            ...sceneObjects.placedWalls,
            ...sceneObjects.wallComponents,
            ...converted,
        ], canvasState.scene);

        return () => {
            disposeSceneObjects(canvasState.scene, renderer, [
                ...sceneObjects.floors,
                ...sceneObjects.wallComponents,
                ...sceneObjects.placedWalls,
                ...converted,
            ]);
        };
    }, [sceneObjects, canvasState]);

    const [, setInputWallHeight] = useState<number>();

    const updateSceneWallHeight = (value: number) => {
        sceneObjects.wallHeight = value;
        setInputWallHeight(value); // refresh component
    };

    if (sceneObjects.wallHeight === undefined) {
        return (<WallHeightInputHandler onConfirm={updateSceneWallHeight}/>);
    } else {
        return (
            <>
                <FloorPlanMainController
                    className={"app-bottom-menu"}
                    scene={canvasState.scene}
                    mainInputHandler={canvasState.mainInputHandler}
                    wallThickness={wallThickness}
                    wallHeight={sceneObjects.wallHeight}
                    placedWalls={sceneObjects.placedWalls}
                    wallComponents={sceneObjects.wallComponents}
                    floors={sceneObjects.floors}
                    doorDefinitions={doorDefinitions}
                    windowDefinitions={windowDefinitions}
                />
            </>
        );
    }
};

type WallHeightInputHandlerProps = {
    onConfirm: (value: number) => void,
}

const WallHeightInputHandler: React.FC<WallHeightInputHandlerProps> = ({ onConfirm }) => {
    const MIN_ALLOWED_HEIGHT = 0;
    const MAX_ALLOWED_HEIGHT = 1000;

    const [height, setHeight] = useState(DEFAULT_WALL_HEIGHT * 10);

    const changeHeight = (value: string) => {
        const passedNumber = Number(value);
        if (!isNaN(passedNumber)) {
            if (passedNumber > MAX_ALLOWED_HEIGHT) {
                setHeight(MAX_ALLOWED_HEIGHT);
            } else if (passedNumber < MIN_ALLOWED_HEIGHT) {
                setHeight(MIN_ALLOWED_HEIGHT);
            } else {
                setHeight(passedNumber);
            }
        }
    };

    return (
        <>
            <Form.Group className="side-by-side-parent">
                <Form.Label className="side-by-side-child">
                    Set height for all walls (between {MIN_ALLOWED_HEIGHT}cm and {MAX_ALLOWED_HEIGHT}cm):
                </Form.Label>
                <Form.Control className="side-by-side-child" type="text" onChange={event => changeHeight(event.target.value)} value={height}/>
            </Form.Group>
            <Button className="side-by-side-parent" variant={PRIMARY_VARIANT} onClick={() => onConfirm(height / 10)}>
                Confirm
            </Button>
        </>
    );
};
