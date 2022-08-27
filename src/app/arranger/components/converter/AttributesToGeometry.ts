import {AttributeName, AttributeNumber, Attributes} from "../../constants/Types";
import {BufferAttribute, BufferGeometry} from "three";

export class AttributesToGeometry {

    public static process(attributes: Array<Attributes>): BufferGeometry {
        const positions = [];
        const normals = [];
        const uvs = [];
        for (const attribute of attributes) {
            positions.push(...attribute.position);
            normals.push(...attribute.normal);
            uvs.push(...attribute.uv);
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute(AttributeName.POSITION, new BufferAttribute(new Float32Array(positions), AttributeNumber.POSITION));
        geometry.setAttribute(AttributeName.NORMAL, new BufferAttribute(new Float32Array(normals), AttributeNumber.NORMAL));
        geometry.setAttribute(AttributeName.UV, new BufferAttribute(new Float32Array(uvs), AttributeNumber.UV));
        return geometry;
    }
}
