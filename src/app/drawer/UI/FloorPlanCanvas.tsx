import "../../css/MainStyle.css"

import { memo, useLayoutEffect, useRef } from "react";

import { DirectionalLight, GridHelper, HemisphereLight, OrthographicCamera, PerspectiveCamera, Scene, Vector2, Vector3, WebGLRenderer, WebGLRendererParameters } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


type Props = {
  scene: Scene
  clickToDraw: (point: Vector3) => void
  clickToSwitch: (point: Vector3) => void
}

// this is canvas, if there are similarities between room planner canvas then refactor
const FloorPlanCanvas: React.FC<Props> = ({scene, clickToDraw, clickToSwitch}: Props) => {

  const mount = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let renderer: WebGLRenderer;
    let camera: OrthographicCamera;
    let width: number;
    let height: number;
    let hemiLight: HemisphereLight;
    let directLight: DirectionalLight;

    const frustumSize = 1000;

    const pointerMovingPosition = new Vector2();
    const pointerDownPosition = new Vector2();

    init();

    function init() {
      width = mount?.current?.clientWidth ?? 0;
      height = mount?.current?.clientHeight ?? 0;

      const renderParams: WebGLRendererParameters = {
        precision: "lowp",
        // antialias: true,
      }

      renderer = new WebGLRenderer(renderParams);
      const aspect = window.innerWidth / window.innerHeight;
      camera = new OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 2000);
      hemiLight = new HemisphereLight("white", "grey", 0.5);
      directLight = new DirectionalLight("white", 0.4);
      directLight.position.set(0, 30, 10);
      directLight.target.position.set(0, 0, 10);

      scene.add(hemiLight, directLight);
      scene.add(new GridHelper(5000, 5000/50, 0x222222, 0x222222));

      renderer.setSize(width, height);
  
      camera.position.set(0, 2, 0);
      camera.lookAt(0, 0, 0);
      
      const controls = new OrbitControls( camera, renderer.domElement );



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

      renderer.setSize(width, height);
      render();
    }

    function handlePointerMove(event: PointerEvent) {
      const x = (event.clientX / width) * 2 - 1;
      const y = -(event.clientY / height) * 2 + 1;
      const v = new Vector3(x, y, 0);
      // const v = new Vector3(
        // (event.clientX / width) * 2 - 1,
        // -(event.clientY / height) * 2 + 1,
        // (camera.near + camera.far) / (camera.near - camera.far)
      // );
      clickToDraw(v.unproject(camera));
    }

    function handlePointerDown(event: PointerEvent) {
      const x = (event.clientX / width) * 2 - 1;
      const y = -(event.clientY / height) * 2 + 1;
      const v = new Vector3(x, y, 0);
      // const v = new Vector3(
        // (event.clientX / width) * 2 - 1,
        // -(event.clientY / height) * 2 + 1,
        // (camera.near + camera.far) / (camera.near - camera.far)
      // );
      clickToSwitch(v.unproject(camera));
    }

  }, []);

  return (
    <div className="Render" ref={mount}/>
  );

}

export default memo(FloorPlanCanvas);
