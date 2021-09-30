import "./css/MainStyle.css"

import { useLayoutEffect, useRef } from "react";

import { BufferAttribute, BufferGeometry, DirectionalLight, ExtrudeBufferGeometry, HemisphereLight, Matrix4, Mesh, MeshBasicMaterial, PerspectiveCamera, Quaternion, Scene, Shape, Vector2, Vector3, WebGLRenderer, WebGLRendererParameters } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Wall from "./Wall";
import Window from "./Window";


export default function RoomPlanner() {

  const mount = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let renderer: WebGLRenderer;
    let scene: Scene;
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
      scene = new Scene();
      camera = new PerspectiveCamera(50, width / height, 0.1, 1000);
      hemiLight = new HemisphereLight("white", "grey", 0.5);
      directLight = new DirectionalLight("white", 1.0);
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

      var wallLength = 200, wallThickness = 20;

      const wall = Wall.create({length: 50, height: 20, width: 2});
      scene.add(wall.mainWallFrame);

      // create window for wall
      const windowOfWall = Window.create({x: 10, y: 2}, wall);

      var mesh = createWall(wallLength, wallThickness, 1);
      // var mesh2 = createWall(wallLength, wallThickness, -1);
      const face = createFace();
      mesh.add(face);



      const matrixToDisplay1 = mesh.matrix.clone().transpose().toArray();
      for (let i = 0; i < 4; i++) {
        let row: string = "[";
        for (let j = 0; j < 4; j++) {
          row+= matrixToDisplay1[i*4 + j] + ", ";
        }
        console.log(row + "]");
      }

      const v3 = new Vector3();
      const vGetWorld = new Vector3();

      console.log("world: " + JSON.stringify(v3) + " local: " + JSON.stringify(face.position));


      mesh.rotateY(90);
      mesh.position.set(3,3,3);
      mesh.updateMatrix();
      
      
      face.translateX(5);
      face.translateY(5);


      v3.copy(face.position);
      v3.applyMatrix4(mesh.matrix);
      
      face.getWorldPosition(vGetWorld);

      console.log(v3.equals(vGetWorld));

      console.log("my world: " + JSON.stringify(v3) + " real world: " + JSON.stringify(vGetWorld));

      console.log(face.matrix);
      
      const matrixToDisplay = mesh.matrix.clone().transpose().toArray();
      for (let i = 0; i < 4; i++) {
        let row: string = "[";
        for (let j = 0; j < 4; j++) {
          row+= matrixToDisplay[i*4 + j].toFixed(2) + "\t";
        }
        console.log(row + "]");
      }

      const pos = new Vector3();
      const quat = new Quaternion();
      const scale = new Vector3();
      mesh.matrix.decompose(pos, quat, scale);
      console.log(pos, quat, scale);



      console.log("trans", mesh.matrix.clone().transpose());
      console.log("mesh", mesh.matrix);
     
      
      console.log(new Vector3(5, 5, 5).applyMatrix4(new Matrix4().makeRotationY(90)));



      // scene.add(mesh);


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
        depth: 200,
        bevelEnabled: false
      };

      var geometry = new ExtrudeBufferGeometry(shape, extrudeSettings);
      geometry.computeBoundingBox();
      // geometry.center();
      return new Mesh(geometry, [
        new MeshBasicMaterial({ color: 0x00ff00 }),
        new MeshBasicMaterial({ color: 0xffff00 }),
        new MeshBasicMaterial({ color: 0xffffff })
      ]);
    }

    function createFace() {
      const geometry = new BufferGeometry();
      // create a simple square shape. We duplicate the top left and bottom right
      // vertices because each vertex needs to appear once per triangle.
      const vertices = new Float32Array([
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,

        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, -1.0, 1.0
      ]);

      // itemSize = 3 because there are 3 values (components) per vertex
      geometry.setAttribute('position', new BufferAttribute(vertices, 3));
      const material = new MeshBasicMaterial({ color: 0xff0000 });
      return new Mesh(geometry, material);
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
