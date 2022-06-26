import {RepeatWrapping, TextureLoader} from "three";
// import uvMapUrl from "../../textures/hardwood.jpg";

const textureLoader = new TextureLoader();

export const loadHardwoodTxt = async () => {
    const txt = await textureLoader.loadAsync("/textures/hardwood.jpg");
    txt.wrapT = RepeatWrapping;
    txt.wrapS = RepeatWrapping;
    console.log("THIS SHOULD BE CALLED ONLY ONCE PER TEXTURE!");
    return txt;
};

// const uvPromise = placeH();
// const uvTxtPromise = createPromise("/textures/hardwood.jpg");

// export const loadHardwoodTxt = async () => {
//     const txt = await uvPromise;
//     const clone = txt.clone();
//     clone.needsUpdate = true;
//     return clone;
// };
