import "../../css/MainStyle.css";

import React, {memo, useLayoutEffect, useRef} from "react";
import {Scene, Vector3, WebGLRenderer,} from "three";
import {MainInputHandler} from "./inputHandler/MainInputHandler";
import {MainCameraHandler} from "../MainCameraHandler";

type Pointer = {
    onCanvas: boolean,
    vectorToUnproject: Vector3,
    clicked: boolean,
}

type Props = {
    scene: Scene,
    renderer: WebGLRenderer,
    mainCameraHandler: MainCameraHandler,
    mainInputHandler: MainInputHandler,
}

/**
 * Whole {@link Props} passed here consist of stateful objects, Component does not need to be rerendered.
 */
const CanvasBase: React.FC<Props> = (props: Props) => {

    console.log("Canvas: ", props.scene.id);
    console.log(props);

    const mount = useRef<HTMLDivElement>(null);

    function getOffsetPosition(event: PointerEvent, width: number, height: number) {
        const offsetLeft = mount?.current?.offsetLeft ?? 0;
        const offsetTop = mount?.current?.offsetTop ?? 0;
        const x = ((event.pageX - offsetLeft) / width) * 2 - 1;
        const y = -((event.pageY - offsetTop) / height) * 2 + 1;
        return {x, y};
    }

    useLayoutEffect(() => {
        let width: number;
        let height: number;


        let pointer: Pointer = { onCanvas: false, vectorToUnproject: new Vector3(), clicked: false };

        init();

        function init() {
            width = mount?.current?.clientWidth ?? 0;
            height = mount?.current?.clientHeight ?? 0;

            // render in given space on webpage
            mount?.current?.appendChild(props.renderer.domElement);

            // listeners
            window.addEventListener("resize", handleResize);
            mount?.current?.addEventListener("pointermove", handlePointerMove);
            mount?.current?.addEventListener("pointerdown", handlePointerDown);
            mount?.current?.addEventListener("pointerenter", handlePointerEnter);
            mount?.current?.addEventListener("pointerleave", handlePointerLeave);

            animate();
            handleResize();
        }

        function animate() {
            render();
            requestAnimationFrame(animate);
        }

        function render() {
            if (pointer.onCanvas) {
                const unprojection = pointer.vectorToUnproject.clone().unproject(props.mainCameraHandler.getCamera());

                if (pointer.clicked) {
                    props.mainInputHandler.handleClick(unprojection);
                    // the click was read
                    pointer = {
                        onCanvas: pointer.onCanvas,
                        vectorToUnproject: pointer.vectorToUnproject.clone(),
                        clicked: false
                    };
                } else {
                    props.mainInputHandler.handleMovement(unprojection);
                }
            }

            props.renderer.render(props.scene, props.mainCameraHandler.getCamera());
        }

        function handleResize() {
            width = mount?.current?.clientWidth ?? 0;
            height = mount?.current?.clientHeight ?? 0;
            const aspect = width / height;
            props.mainCameraHandler.setAspectRatio(aspect);
            props.renderer.setSize(width, height);
            render();
        }

        /**
         * Keeps track of pointer position.
         * @param event move event
         */
        function handlePointerMove(event: PointerEvent) {
            const {x, y} = getOffsetPosition(event, width, height);
            pointer = {
                onCanvas: pointer.onCanvas,
                vectorToUnproject: new Vector3(x, y, 0),
                clicked: pointer.clicked
            };
        }

        /**
         * Switches pointer down and sets pointer position.
         * @param event down event
         */
        function handlePointerDown(event: PointerEvent) {
            const {x, y} = getOffsetPosition(event, width, height);
            pointer = {
                onCanvas: pointer.onCanvas,
                vectorToUnproject: new Vector3(x, y, 0),
                clicked: true
            };
        }

        function handlePointerEnter(event: PointerEvent) {
            const {x, y} = getOffsetPosition(event, width, height);
            pointer = {
                onCanvas: true,
                vectorToUnproject: new Vector3(x, y, 0),
                clicked: pointer.clicked
            };
        }

        function handlePointerLeave() {
            pointer = {
                onCanvas: false,
                vectorToUnproject: pointer.vectorToUnproject,
                clicked: pointer.clicked
            };
        }

    }, [props]);

    return (
        <div className="app-canvas" ref={mount}/>
    );

};

export const Canvas = memo(CanvasBase, (prev, next) => {
    return prev.scene === next.scene;
});
