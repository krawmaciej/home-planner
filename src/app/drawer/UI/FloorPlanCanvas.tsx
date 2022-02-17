import "../../css/MainStyle.css"

import { memo, useLayoutEffect, useRef } from "react";

import { DirectionalLight, GridHelper, HemisphereLight, OrthographicCamera, PerspectiveCamera, Scene, Vector2, Vector3, WebGLRenderer, WebGLRendererParameters } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DrawingState, Pointer } from "./Pointer";


type Props = {
  scene: Scene
  clickToDraw: (start: Vector3, end: Vector3) => void
  clickToSwitch: (start: Vector3, end: Vector3) => void
}

// this is canvas, if there are similarities between room planner canvas then refactor
const FloorPlanCanvas: React.FC<Props> = ({scene, clickToDraw: drawWall, clickToSwitch: moveDrawedWall}: Props) => {

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

    let pointer: Pointer = new Pointer();

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
      camera = new OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 3);

      // console.log(scene.getWorldPosition(grid.position));
      // grid.translateY(-5);
      scene.add(new GridHelper(100, 100, 0xbbbbbb, 0xbbbbbb));

      renderer.setSize(width, height);
  
      camera.position.set(0, -2, 0);
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
      if (pointer.state === DrawingState.NONE) {
        // no op
      } else if (pointer.state === DrawingState.DRAWING) {
        const z = (camera.near + camera.far) / (camera.near - camera.far);

        // todo: start will be always the same, unprojection can be cached
        const start = new Vector3(
          pointer.startPosition.x,
          pointer.startPosition.y,
          z
        );

        const end = new Vector3(
          pointer.endPosition.x,
          pointer.endPosition.y,
          z
        );

        moveDrawedWall(start.unproject(camera), end.unproject(camera));

      } else if (pointer.state === DrawingState.DRAW) {
        const z = (camera.near + camera.far) / (camera.near - camera.far);
        const start = new Vector3(
          pointer.startPosition.x,
          pointer.startPosition.y,
          z
        );
        const end = new Vector3(
          pointer.endPosition.x,
          pointer.endPosition.y,
          z
        );
        pointer = pointer.draw();
        drawWall(start.unproject(camera), end.unproject(camera));
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
      pointer = pointer.changePosition({ x: x, y: y });
      // const v = new Vector3(
        // (event.clientX / width) * 2 - 1,
        // -(event.clientY / height) * 2 + 1,
        // (camera.near + camera.far) / (camera.near - camera.far)
      // );
      // clickToDraw(v.unproject(camera));
    }

    /**
     * Switches pointer down and sets pointer position.
     * @param event down event
     */
    function handlePointerDown(event: PointerEvent) {
      const x = (event.clientX / width) * 2 - 1;
      const y = -(event.clientY / height) * 2 + 1;

      if (pointer.state === DrawingState.NONE) {
        pointer = pointer.startDrawing({ x: x, y: y });
      } else if (pointer.state === DrawingState.DRAWING) {
        pointer = pointer.stopDrawing({ x: x, y: y });
      }
      // DO NOT HANDLE DRAW STATE

      // const v = new Vector3(x, y, 0);
      // const v = new Vector3(
        // (event.clientX / width) * 2 - 1,
        // -(event.clientY / height) * 2 + 1,
        // (camera.near + camera.far) / (camera.near - camera.far)
      // );
      // clickToSwitch(v.unproject(camera));
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Render" ref={mount}/>
  );

}

export default memo(FloorPlanCanvas);
