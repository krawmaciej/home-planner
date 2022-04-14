import { Group } from "three";
import { Dimensions } from "../constants/Types";

export class ImportedObject {
    public readonly dimensions: Dimensions = {length: 10, height: 18, width: 2};
    public readonly mainMesh: Group = new Group(); // TODO: now empty object, change to mesh
}

export class ObjectFactory {
    private static readonly cachedObject: ImportedObject = new ImportedObject();

    public static loadWindow() {
        return this.cachedObject;
    }
}
