import {Texture} from "three";

export type TextureDefinition = {
    file: string,
    repeat?: [number, number],
}

export type LoadedTexture = {
    url: string,
    texture: Promise<Texture>,
}
