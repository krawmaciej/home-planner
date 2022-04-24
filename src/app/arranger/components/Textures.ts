import {RepeatWrapping, TextureLoader} from "three";
import uvMapUrl from "../../textures/hardwood.jpg";

const textureLoader = new TextureLoader();

const uvPromise = async () => {
    const txt = await textureLoader.loadAsync(uvMapUrl);
    txt.wrapT = RepeatWrapping;
    txt.wrapS = RepeatWrapping;
    return txt;
};

const uvTxtPromise = uvPromise();

export const instanceOfUvTxt = async () => {
    const txt = await uvTxtPromise;
    const clone = txt.clone();
    clone.needsUpdate = true;
    return clone;
};
