import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {ComponentProps} from "../objects/window/WallComponent";
import {Box3, Group, Vector3} from "three";

const X_AXIS = new Vector3(1, 0, 0);
const Y_AXIS = new Vector3(0, 1, 0);
const Z_AXIS = new Vector3(0, 0, 1);

const RADIAN_MULTIPLIER = Math.PI / 180.0;

type ModelDefinition = {
    name: string,
    file: string,
    width: number,
    initialElevation?: number,
    rotate: Rotation,
    offsetPosition: OffsetPosition,
    holeMargins: HoleMargins,
}

type Rotation = {
    x: number,
    y: number,
    z: number,
}

type OffsetPosition = Rotation;

type HoleMargins = {
    horizontal: number,
    top: number,
    bottom: number,
}

const createFetchPromise = async (fileName: string) => {
    const file = await fetch(fileName);
    return await file.json();
};

const doorsPromise = createFetchPromise("/doors/doors.json");

export const loadDoors = async () => {
    const result = new Array<ComponentProps>();
    const gltfLoader = new GLTFLoader();
    const doorDefinitions = await doorsPromise as Array<ModelDefinition>;
    for (const doorDefinition of doorDefinitions) {
        const gltf = (await gltfLoader.loadAsync("/doors/" + doorDefinition.file)).scene;
        gltf.rotateOnAxis(X_AXIS, doorDefinition.rotate.x * RADIAN_MULTIPLIER);
        gltf.rotateOnAxis(Y_AXIS, doorDefinition.rotate.y * RADIAN_MULTIPLIER);
        gltf.rotateOnAxis(Z_AXIS, doorDefinition.rotate.z * RADIAN_MULTIPLIER);
        const box3 = new Box3().setFromObject(gltf);
        const modelWidth = box3.max.x - box3.min.x;
        const scalar = (doorDefinition.width / 10) / modelWidth;
        gltf.scale.multiplyScalar(scalar);
        box3.setFromObject(gltf);
        const center = box3.getCenter(new Vector3());
        gltf.position.sub(center);
        const model = new Group().add(gltf);
        result.push({
            object3d: model,
            width: doorDefinition.width / 10,
            thickness: 1,
            height: box3.max.y - box3.min.y,
            elevation: 0,
        } as ComponentProps);
    }
    return result;
};
