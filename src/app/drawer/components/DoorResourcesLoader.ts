import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {ComponentProps} from "../objects/window/WallComponent";
import {Box3, Group, Material, Matrix4, Mesh, Vector3} from "three";

const X_AXIS = new Vector3(1, 0, 0);
const Y_AXIS = new Vector3(0, 1, 0);
const Z_AXIS = new Vector3(0, 0, 1);

const RADIAN_MULTIPLIER = Math.PI / 180.0;

type ModelDefinition = {
    name: string,
    file: string,
    dimensions: Dimensions,
    doubleSided?: boolean,
    initialElevation?: number,
    rotate: Rotation,
    offsetPosition: OffsetPosition,
    holeMargins: HoleMargins,
}

type Dimensions = {
    width: number,
    height?: number,
    thickness?: number,
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

const xyzToVector3 = ({x, y, z}: { x: number, y: number, z: number }) => {
    return new Vector3(x, y, z);
};

const getScaleVector = (dimensions: Dimensions, box3: Box3) => {
    const objectWidth     = box3.max.x - box3.min.x;
    const objectHeight    = box3.max.y - box3.min.y;
    const objectThickness = box3.max.z - box3.min.z;

    const scale = (dimensions.width / 10) / objectWidth;
    const vectorArray = [scale];

    if (dimensions.height) {
        vectorArray.push((dimensions.height / 10) / objectHeight);
    } else {
        vectorArray.push(scale);
    }

    if (dimensions.thickness) {
        vectorArray.push((dimensions.thickness / 10) / objectThickness);
    } else {
        vectorArray.push(scale);
    }

    return new Vector3().fromArray(vectorArray);
};

export const loadDoors = async () => {
    const result = new Array<ComponentProps>();
    const gltfLoader = new GLTFLoader();
    const doorDefinitions = await doorsPromise as Array<ModelDefinition>;
    for (const doorDefinition of doorDefinitions) {
        const model = new Group();

        const gltf = (await gltfLoader.loadAsync("/doors/" + doorDefinition.file)).scene;
        gltf.rotateOnAxis(X_AXIS, doorDefinition.rotate.x * RADIAN_MULTIPLIER);
        gltf.rotateOnAxis(Y_AXIS, doorDefinition.rotate.y * RADIAN_MULTIPLIER);
        gltf.rotateOnAxis(Z_AXIS, doorDefinition.rotate.z * RADIAN_MULTIPLIER);

        const box3 = new Box3().setFromObject(gltf);
        const scaleVector = getScaleVector(doorDefinition.dimensions, box3);
        gltf.applyMatrix4(new Matrix4().makeScale(scaleVector));

        box3.setFromObject(gltf);
        const center = box3.getCenter(new Vector3());
        gltf.position.sub(center);
        const offset = xyzToVector3(doorDefinition.offsetPosition).multiplyScalar(0.1);
        gltf.position.add(offset);
        model.add(gltf);
        if (doorDefinition.doubleSided) {
            const mirrored = gltf.clone();
            model.add(mirrored);
            mirrored.applyMatrix4(new Matrix4().makeScale(1, 1, -1));
            mirrored.traverse(obj => {
                if (obj instanceof Mesh && obj.material instanceof Material) {
                    const newMaterial = obj.material.clone();
                    newMaterial.setValues({
                        polygonOffset: true,
                        polygonOffsetUnits: 0.1,
                        polygonOffsetFactor: 1,
                    });
                    obj.material = newMaterial;
                }
            });
        }
        result.push({
            object3d: model,
            width: doorDefinition.dimensions.width / 10,
            thickness: 1,
            height: box3.max.y - box3.min.y,
            elevation: 0,
        } as ComponentProps);
    }
    return result;
};
