import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {ComponentProps} from "../../drawer/objects/window/WallComponent";
import {Box3, Group, Material, Matrix4, Mesh, Object3D, Vector3} from "three";
import {Dimensions, ModelDefinition} from "./ModelDefinition";
import {ObjectProps} from "../../arranger/objects/ImportedObject";

const X_AXIS = new Vector3(1, 0, 0);
const Y_AXIS = new Vector3(0, 1, 0);
const Z_AXIS = new Vector3(0, 0, 1);

const RADIAN_MULTIPLIER = Math.PI / 180.0;

const DOORS_PATH = "/doors";
const DOORS_DEFINITION_FILE = "doors.json";
const WINDOWS_PATH = "/windows";
const WINDOWS_DEFINITION_FILE = "windows.json";
const OBJECTS_PATH = "/objects";
const OBJECTS_DEFINITION_FILE = "objects.json";

const createFetchPromise = async (fileName: string) => {
    const file = await fetch(fileName);
    try {
        return await file.json() as Promise<Array<ModelDefinition>>;
    } catch (e) {
        console.error(`Model definitions file: ${fileName} is malformed.`, e);
        return Promise.resolve([]);
    }
};

const doorsPromise = createFetchPromise(`${DOORS_PATH}/${DOORS_DEFINITION_FILE}`);
const windowsPromise = createFetchPromise(`${WINDOWS_PATH}/${WINDOWS_DEFINITION_FILE}`);
const objectsPromise = createFetchPromise(`${OBJECTS_PATH}/${OBJECTS_DEFINITION_FILE}`);

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
    return await loadModels(doorsPromise, DOORS_PATH, (modelDefinition, model, box3) => {
        return {
            name: modelDefinition.name,
            thumbnail: modelDefinition.thumbnail, // todo: then load is as ahref or something
            object3d: model,
            width: modelDefinition.dimensions.width / 10,
            thickness: 1,
            height: box3.max.y - box3.min.y,
            elevation: 0,
        } as ComponentProps;
    });
};

export const loadWindows = async () => {
    return await loadModels(windowsPromise, WINDOWS_PATH, (modelDefinition, model, box3) => {
        return {
            name: modelDefinition.name,
            thumbnail: modelDefinition.thumbnail, // todo: then load is as ahref or something
            object3d: model,
            width: modelDefinition.dimensions.width / 10,
            thickness: 1,
            height: box3.max.y - box3.min.y,
            elevation: (modelDefinition.elevation ?? 0) / 10,
        } as ComponentProps;
    });
};

export const loadObjects = async (): Promise<ObjectProps[]> => {
    return await loadModels(objectsPromise, OBJECTS_PATH, (modelDefinition, model, box3) => {
        return {
            name: modelDefinition.name,
            thumbnail: modelDefinition.thumbnail, // todo: then load is as ahref or something
            object3d: model,
            colliding: false,
        };
    });
};

async function handleFileLoad(gltfLoader: GLTFLoader, path: string, doorDefinition: ModelDefinition) {
    try {
        return (await gltfLoader.loadAsync(`${path}/${doorDefinition.file}`)).scene;
    } catch (e) {
        console.error(`Error loading file ${JSON.stringify(doorDefinition)}`, e);
        return undefined;
    }
}

const loadModels = async<T>(
    modelsPromise: Promise<Array<ModelDefinition>>,
    path: string,
    resultMapper: (md: ModelDefinition, obj: Object3D, box: Box3) => T
) => {
    const result = new Array<T>();
    const gltfLoader = new GLTFLoader();
    const modelDefinitions = await modelsPromise;
    for (const modelDefinition of modelDefinitions) {
        const model = new Group();
        const gltf = await handleFileLoad(gltfLoader, path, modelDefinition);
        if (gltf === undefined) {
            continue;
        }
        gltf.rotateOnAxis(X_AXIS, modelDefinition.rotate.x * RADIAN_MULTIPLIER);
        gltf.rotateOnAxis(Y_AXIS, modelDefinition.rotate.y * RADIAN_MULTIPLIER);
        gltf.rotateOnAxis(Z_AXIS, modelDefinition.rotate.z * RADIAN_MULTIPLIER);

        const box3 = new Box3().setFromObject(gltf);
        const axisScales = getAxisScales(modelDefinition.dimensions, box3);
        gltf.applyMatrix4(new Matrix4().makeScale(axisScales.x, axisScales.y, axisScales.z));

        box3.setFromObject(gltf);
        const center = box3.getCenter(new Vector3());
        gltf.position.sub(center);
        const offset = xyzToVector3(modelDefinition.offsetPosition).multiplyScalar(0.1);
        gltf.position.add(offset);
        model.add(gltf);
        if (modelDefinition.doubleSided) {
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
        result.push(resultMapper(modelDefinition, model, box3));
    }
    return result;
};
