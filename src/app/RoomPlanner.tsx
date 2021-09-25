import "./css/MainStyle.css"

import React, { useLayoutEffect, useRef } from "react";

import { BufferGeometry, Line, LineBasicMaterial, PerspectiveCamera, Scene, Shape, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


//TODO: DO RESIZE RENDERER ON RESIZE LISTENER HOOK W/E

export default function RoomPlanner() {

  const mount = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let renderer: WebGLRenderer;
    let scene: Scene;
    let camera: PerspectiveCamera;
    let width: number;
    let height: number;

    init();

    function init() {
      width = mount?.current?.clientWidth ?? 0;
      height = mount?.current?.clientHeight ?? 0;

      renderer = new WebGLRenderer({ antialias: true });
      scene = new Scene();
      camera = new PerspectiveCamera(75, width / height, 0.1, 1000);

      renderer.setSize(width, height);
  
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);

      // camera controlls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.minZoom = 0.5;
      controls.maxZoom = 2;

      function createRectangle(start: Vector3, end: Vector3) {
        const points = [];
        // console.log(start);
        // console.log(end);
        const startX = start.x;
        const startY = start.y;
        const endX = end.x;
        const endY = end.y;
        points.push(new Vector3(startX, startY, 0));
        points.push(new Vector3(endX, startY, 0));
        points.push(new Vector3(endX, endY, 0));
        points.push(new Vector3(startX, endY, 0));
        points.push(new Vector3(startX, startY, 0));
        return points;
      }

      const points = createRectangle(new Vector3(-10, 10, 0), new Vector3(10, -10, 0));
      const geometry = new BufferGeometry().setFromPoints(points);

      // const p2 = createRectangle(new Vector3(-10, -10, 0), new THREE.Vector3(-5, -20, 0));
      // const g2 = new BufferGeometry().setFromPoints(p2);

      // const merge = BufferGeometryUtils.mergeBufferGeometries([geometry, g2]);


      const material = new LineBasicMaterial({ color: 0xffaadd });
      const line = new Line(geometry, material);
      // const line = new Line(geometry, material);
      // const l2 = new line(g2, material);



      // var geometry = new BoxGeometry( 100, 100, 100 );
      // var material = new MeshBasicMaterial( { color: 0x00ff00 } );
      // var cube = new Mesh( geometry, material );
      scene.add(line);

      const lineLength = 20, lineWidth = 20;

      const shape = new Shape();
      shape.moveTo(0, 0);
      shape.lineTo(0, lineWidth);
      shape.lineTo(lineLength, lineWidth);
      shape.lineTo(lineLength, 0);
      shape.lineTo(0, 0);

      const extrudeSettings = {
        steps: 2,
        depth: 1,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1
      };

      mount?.current?.appendChild(renderer.domElement);

      // listeners
      window.addEventListener('resize', handleResize);
      mount?.current?.addEventListener('click', handleOnClick);

      animate();
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
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
      console.log("wid: " + width);
      console.log("hei: " + height);
    }

    function handleOnClick() {
      // STATE.notifyListener();
      // console.log(STATE.getCurrentMenuKey());
    }

  }, []);

  return (
    <div className="Render" ref={mount}/>
  );

}
