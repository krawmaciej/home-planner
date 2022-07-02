import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {ComponentProps} from "../objects/window/WallComponent";
import {Box3, Group, Material, Matrix4, Mesh, Vector3} from "three";
import {Dimensions, ModelDefinition} from "./ModelDefinitions";

const X_AXIS = new Vector3(1, 0, 0);
const Y_AXIS = new Vector3(0, 1, 0);
const Z_AXIS = new Vector3(0, 0, 1);

const RADIAN_MULTIPLIER = Math.PI / 180.0;

const DOORS_PATH = "/doors";
const DOORS_DEFINITION_FILE = "doors.json";
const WINDOWS_PATH = "/windows";
const WINDOWS_DEFINITION_FILE = "windows.json";

const createFetchPromise = async (fileName: string) => {
    const file = await fetch(fileName);
    return await file.json();
};

const doorsPromise = createFetchPromise(`${DOORS_PATH}/${DOORS_DEFINITION_FILE}`);
const windowsPromise = createFetchPromise(`${WINDOWS_PATH}/${WINDOWS_DEFINITION_FILE}`);

const xyzToVector3 = ({x, y, z}: { x: number, y: number, z: number }) => {
    return new Vector3(x, y, z);
};

const getAxisScales = (dimensions: Dimensions, box3: Box3) => {
    const objectWidth     = box3.max.x - box3.min.x;
    const objectHeight    = box3.max.y - box3.min.y;
    const objectThickness = box3.max.z - box3.min.z;

    const scale = (dimensions.width / 10) / objectWidth;
    const scaling = {
        x: scale,
        y: scale,
        z: scale,
    };

    if (dimensions.height) {
        scaling.y = (dimensions.height / 10) / objectHeight;
    }

    if (dimensions.thickness) {
        scaling.z = (dimensions.thickness / 10) / objectThickness;
    }

    return scaling;
};

export const loadDoors = async () => {
    return await loadModels(doorsPromise, DOORS_PATH);
};

export const loadWindows = async () => {
    return await loadModels(windowsPromise, WINDOWS_PATH);
};

const loadModels = async (modelsPromise: Promise<any>, path: string) => {
    const result = new Array<ComponentProps>();
    const gltfLoader = new GLTFLoader();
    const doorDefinitions = await modelsPromise as Array<ModelDefinition>;
    for (const doorDefinition of doorDefinitions) {
        const model = new Group();

        const gltf = (await gltfLoader.loadAsync(`${path}/${doorDefinition.file}`)).scene;
        gltf.rotateOnAxis(X_AXIS, doorDefinition.rotate.x * RADIAN_MULTIPLIER);
        gltf.rotateOnAxis(Y_AXIS, doorDefinition.rotate.y * RADIAN_MULTIPLIER);
        gltf.rotateOnAxis(Z_AXIS, doorDefinition.rotate.z * RADIAN_MULTIPLIER);

        const box3 = new Box3().setFromObject(gltf);
        const axisScales = getAxisScales(doorDefinition.dimensions, box3);
        gltf.applyMatrix4(new Matrix4().makeScale(axisScales.x, axisScales.y, axisScales.z));

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
            name: doorDefinition.name,
            thumbnail: doorDefinition.thumbnail, // todo: then load is as ahref or something
            object3d: model,
            width: doorDefinition.dimensions.width / 10,
            thickness: 1,
            height: box3.max.y - box3.min.y,
            elevation: (doorDefinition.elevation ?? 0) / 10,
        } as ComponentProps);
    }
    return result;
};
