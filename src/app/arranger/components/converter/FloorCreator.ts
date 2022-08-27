import {Floor} from "../../../drawer/objects/floor/Floor";
import { Mesh, MeshBasicMaterialParameters} from "three";
import { Attributes, Coordinate, Facing} from "../../constants/Types";
import {loadHardwoodTxt} from "../../loaders/Textures";
import {ObjectPoint} from "../../../drawer/constants/Types";
import {AttributesToGeometry} from "./AttributesToGeometry";

export class FloorCreator {

    public createFromFloor(floor: Floor) {
        const attributes = FloorCreator.createAttributes(floor);
        const geometry = AttributesToGeometry.process(attributes);

        loadHardwoodTxt().then(txt => {
            console.log("txtid: ", txt.id);
            console.log("txtuuid: ", txt.uuid);

            txt.repeat.set(0.1, 0.1);
            floor.meshMaterial.setValues({
                map: txt,
                color: 0x888888,
                // depthWrite: false,
            } as MeshBasicMaterialParameters);

            floor.meshMaterial.needsUpdate = true;
        });
        return new Mesh(geometry, floor.meshMaterial);
    }

    private static createAttributes(floor: Floor): Array<Attributes> {
        const points = floor.getObjectPointsOnScene();

        const bottomLeft = points[ObjectPoint.BOTTOM_LEFT].toArray();
        const topLeft = points[ObjectPoint.TOP_LEFT].toArray();
        const topRight = points[ObjectPoint.TOP_RIGHT].toArray();
        const bottomRight = points[ObjectPoint.BOTTOM_RIGHT].toArray();

        // put on the floor level
        bottomLeft[Coordinate.Y] = 0;
        topLeft[Coordinate.Y] = 0;
        topRight[Coordinate.Y] = 0;
        bottomRight[Coordinate.Y] = 0;

        return [
            {position: bottomLeft,  normal: Facing.UP, uv: FloorCreator.toUv(bottomLeft) },
            {position: bottomRight, normal: Facing.UP, uv: FloorCreator.toUv(bottomRight)},
            {position: topRight,    normal: Facing.UP, uv: FloorCreator.toUv(topRight)   },
            {position: topRight,    normal: Facing.UP, uv: FloorCreator.toUv(topRight)   },
            {position: topLeft,     normal: Facing.UP, uv: FloorCreator.toUv(topLeft)    },
            {position: bottomLeft,  normal: Facing.UP, uv: FloorCreator.toUv(bottomLeft) },
        ];
    }

    private static toUv(coordinates: Array<number>) {
        if (coordinates.length !== 3) {
            throw new Error(`Malformed Vector3 with coordinates: ${coordinates} while creating floors.`);
        }
        return [coordinates[Coordinate.X], coordinates[Coordinate.Z]];
    }
}
