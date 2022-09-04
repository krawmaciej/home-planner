import {Box3, Object3D, Vector3} from "three";

export const findHalfOfObjectHeight = (object3d: Object3D) => {
    const box3 = new Box3().setFromObject(object3d);
    const box3Size = box3.getSize(new Vector3());
    return box3Size.y / 2.0;
};
