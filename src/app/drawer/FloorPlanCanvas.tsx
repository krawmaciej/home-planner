import "../css/MainStyle.css"

import { memo, useLayoutEffect, useRef } from "react";

import { DirectionalLight, HemisphereLight, PerspectiveCamera, Scene, Vector2, WebGLRenderer, WebGLRendererParameters } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


type Props = {
  scene: Scene
  setPosition: React.Dispatch<React.SetStateAction<Vector2 | undefined>>
}

// this is canvas, if there are similarities between room planner canvas then refactor
const FloorPlanCanvas: React.FC<Props> = ({scene, setPosition}: Props) => {

  const mount = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let renderer: WebGLRenderer;
    let camera: PerspectiveCamera;
    let width: number;
    let height: number;
    let hemiLight: HemisphereLight;
    let directLight: DirectionalLight;

    init();

    function init() {
      width = mount?.current?.clientWidth ?? 0;
      height = mount?.current?.clientHeight ?? 0;

      const renderParams: WebGLRendererParameters = {
        precision: "lowp",
        // antialias: true,
      }

      renderer = new WebGLRenderer(renderParams);
      camera = new PerspectiveCamera(50, width / height, 0.1, 1000);
      hemiLight = new HemisphereLight("white", "grey", 0.5);
      directLight = new DirectionalLight("white", 0.4);
      directLight.position.set(0, 30, 10);
      directLight.target.position.set(0, 0, 10);

      scene.add(hemiLight, directLight);

      renderer.setSize(width, height);
  
      camera.position.set(0, 60, 50);
      camera.lookAt(0, 0, 0);

      // camera controlls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.minZoom = 0.5;
      controls.maxZoom = 2;



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

      animate();
    }

    function animate() {
      // windowOfWall.translateX(0.01);
      render();
      requestAnimationFrame(animate);
    };

    function render() {
      renderer.render(scene, camera);
    };

    function handleResize() {
      width = mount?.current?.clientWidth ?? 0;
      height = mount?.current?.clientHeight ?? 0;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
      console.log("wid: " + width);
      console.log("hei: " + height);
    }

    function handlePointerMove(event: MouseEvent) {
      const x = (event.clientX / width) * 2 - 1;
      const y = (event.clientY / height) * 2 + 1;
      // new Vector2(x, y);
      setPosition(new Vector2(x, y));

      // STATE.notifyListener();
      // console.log(STATE.getCurrentMenuKey());
    }

  }, []);

  return (
    <div className="Render" ref={mount}/>
  );

}

export default FloorPlanCanvas;
