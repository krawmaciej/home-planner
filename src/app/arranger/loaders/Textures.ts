import {RepeatWrapping, Texture, TextureLoader} from "three";
// import uvMapUrl from "../../textures/hardwood.jpg";

fetch("/doors/doors.json")
    .then(response => response.json())
    .then(json => console.log("read: ", json));

const textureLoader = new TextureLoader();

const createPromise = async (fileName: string) => {
    const txt = await textureLoader.loadAsync(fileName);
    txt.wrapT = RepeatWrapping;
    txt.wrapS = RepeatWrapping;
    console.log("THIS SHOULD BE CALLED ONLY ONCE PER TEXTURE!");
    return txt;
};

export const textureMap = new Map<string, Promise<Texture>>();

const uvPromise = createPromise("/textures/hardwood.jpg");
// const uvTxtPromise = createPromise("/textures/hardwood.jpg");

export const instanceOfUvTxt = async () => {
    const txt = await uvPromise;
    const clone = txt.clone();
    clone.needsUpdate = true;
    return clone;
};
