import "./css/MainStyle.css"

import React, { useLayoutEffect, useRef } from "react";

import { ExtrudeBufferGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, Shape, WebGLRenderer } from "three";
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
      camera = new PerspectiveCamera(50, width / height, 0.1, 1000);

      renderer.setSize(width, height);
  
      camera.position.set(25, 25, 50);
      camera.lookAt(0, 0, 0);

      // camera controlls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.minZoom = 0.5;
      controls.maxZoom = 2;

      var wallLength = 8, wallThickness = 4;

      var mesh = createWall(wallLength, wallThickness, 1);
      var mesh2 = createWall(wallLength, wallThickness, -1);

      scene.add(mesh, mesh2);

      console.log(mesh.position);
      console.log(mesh2.position);

      mount?.current?.appendChild(renderer.domElement);

      // listeners
      window.addEventListener('resize', handleResize);
      mount?.current?.addEventListener('click', handleOnClick);

      animate();
    }

    function createWall(wallLength: number, wallThickness: number, direction: 1 | -1) {
      var shape = new Shape();
      shape.moveTo(0, 0 + wallThickness);
      shape.lineTo(0, - (wallLength + wallThickness));
      shape.lineTo(wallThickness*direction, -wallLength);
      shape.lineTo(wallThickness*direction, 0);
      shape.lineTo(0, wallThickness);

      var extrudeSettings = {
        steps: 1,
        depth: 16,
        bevelEnabled: false
      };

      var geometry = new ExtrudeBufferGeometry(shape, extrudeSettings);
      // geometry.center();
      return new Mesh(geometry, [
        new MeshBasicMaterial({ color: 0x00ff00 }),
        new MeshBasicMaterial({ color: 0xffff00 }),
        new MeshBasicMaterial({ color: 0xffffff })
      ]);
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
