import "../../css/MainStyle.css"

import { memo, useLayoutEffect, useRef } from "react";

import { AxesHelper, CircleGeometry, DirectionalLight, GridHelper, HemisphereLight, Mesh, MeshBasicMaterial, OrthographicCamera, PerspectiveCamera, Scene, Vector2, Vector3, WebGLRenderer, WebGLRendererParameters } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderOrder } from "../constants/Types";
import MainInputHandler from "./inputHandlers/MainInputHandler";

type Pointer = {
  vectorToUnproject: Vector3,
  clicked: boolean
}

type Props = {
  scene: Scene,
  mainInputHandler: MainInputHandler
}

// this is canvas, if there are similarities between room planner canvas then refactor
const FloorPlanCanvas: React.FC<Props> = ({scene, mainInputHandler}: Props) => {

  const mount = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let renderer: WebGLRenderer;
    let camera: OrthographicCamera;
    let width: number;
    let height: number;
    let hemiLight: HemisphereLight;
    let directLight: DirectionalLight;
    let controls: OrbitControls;

    const frustumSize = 18;

    let pointer: Pointer = { vectorToUnproject: new Vector3(), clicked: false };

    init();

    function init() {
      width = mount?.current?.clientWidth ?? 0;
      height = mount?.current?.clientHeight ?? 0;

      const renderParams: WebGLRendererParameters = {
        precision: "highp",
        antialias: true,
      }

      renderer = new WebGLRenderer(renderParams);
      const aspect = window.innerWidth / window.innerHeight;
      camera = new OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.1, 500);

      const grid = new GridHelper(100, 100, 0xbbbbbb, 0xbbbbbb);
      grid.renderOrder = RenderOrder.GRID;
      scene.add(grid);

      renderer.setSize(width, height);
  
      camera.position.set(0.0, 4.0, 0.0);
      camera.lookAt(0, 0, 0);

      // controls = new OrbitControls(camera, renderer.domElement);



      // sample
      // const wall = Wall.create({length: 50, height: 20, width: 2});
      // scene.add(wall.mainWallFrame);

      // create window in a wall
      // windowOfWall = Window.create({x: 10, y: 0}, wall);
      // windowOfWall.translateX(5);



      // render in given space on webpage
      mount?.current?.appendChild(renderer.domElement);

      // listeners
      window.addEventListener("resize", handleResize);
      mount?.current?.addEventListener("pointermove", handlePointerMove);
      mount?.current?.addEventListener("pointerdown", handlePointerDown);

      animate();
      handleResize();
    }

    function animate() {
      render();
      requestAnimationFrame(animate);
    };

    function render() {
      const unprojection = pointer.vectorToUnproject.clone().unproject(camera);
      if (pointer.clicked) {
        mainInputHandler.handleClick(unprojection);
        // the click was read
        pointer = {
          vectorToUnproject: pointer.vectorToUnproject.clone(),
          clicked: pointer.clicked = false
        }
      } else {
        mainInputHandler.handleMovement(unprojection);
      }
      renderer.render(scene, camera);
    };

    function handleResize() {
      width = mount?.current?.clientWidth ?? 0;
      height = mount?.current?.clientHeight ?? 0;
      const aspect = width / height;

      camera.left = - frustumSize * aspect / 2;
      camera.right = frustumSize * aspect / 2;
      camera.top = frustumSize / 2;
      camera.bottom = - frustumSize / 2;
      camera.updateProjectionMatrix();

      // controls.update();

      renderer.setSize(width, height);
      render();
    }

    /**
     * Keeps track of pointer position.
     * @param event move event
     */
    function handlePointerMove(event: PointerEvent) {
      const x = (event.clientX / width) * 2 - 1;
			const	y = -(event.clientY / height) * 2 + 1;
      pointer = {
        vectorToUnproject: new Vector3(x, y, 0),
        clicked: pointer.clicked
      }
    }

    /**
     * Switches pointer down and sets pointer position.
     * @param event down event
     */
    function handlePointerDown(event: PointerEvent) {
      const x = (event.clientX / width) * 2 - 1;
      const y = -(event.clientY / height) * 2 + 1;
      pointer = {
        vectorToUnproject: new Vector3(x, y, 0),
        clicked: true
      }
      // old
      // if (pointer.state === DrawingState.NONE) {
      //   pointer = pointer.startDrawing({ x: x, y: y });
      // } else if (pointer.state === DrawingState.DRAWING) {
      //   pointer = pointer.stopDrawing({ x: x, y: y });
      // }
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Render" ref={mount}/>
  );

}

export default memo(FloorPlanCanvas);
