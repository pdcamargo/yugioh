import {
  BoxGeometry,
  Mesh,
  MeshPhysicalMaterial,
  Texture,
  TextureLoader,
} from "three";

import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export const PLAYMAT_DIMENSIONS = {
  width: 620 / 150,
  height: 250 / 150,
  depth: 5 / 150,
};

const playmatGeo = new RoundedBoxGeometry(
  PLAYMAT_DIMENSIONS.width,
  PLAYMAT_DIMENSIONS.height,
  PLAYMAT_DIMENSIONS.depth,
  10,
  4,
);

type Mat = MeshPhysicalMaterial;

type PlaymatMaterial = [Mat, Mat, Mat, Mat, Mat, Mat];

const playmatCache = new Map<string, PlaymatMaterial>();

export type PlaymatMeshOptions = {
  texture: Texture;
  name: string;
};

const textureLoader = new TextureLoader();

export class PlaymatMesh extends Mesh {
  constructor(options: PlaymatMeshOptions) {
    const { texture, name } = options || {};

    const key = name;

    let playmatMaterial: PlaymatMaterial;

    if (playmatCache.has(key)) {
      playmatMaterial = playmatCache.get(key)!;
    } else {
      const roughnessTexture = textureLoader.load("/noise-normal.jpg");
      const normalTexture = textureLoader.load("/noise-normal.jpg");

      playmatMaterial = [
        new MeshPhysicalMaterial(),
        new MeshPhysicalMaterial(),
        new MeshPhysicalMaterial(),
        new MeshPhysicalMaterial(),
        new MeshPhysicalMaterial(),
        new MeshPhysicalMaterial({
          map: texture,
          normalMap: normalTexture,
          roughness: 100,
          metalness: 0,
          roughnessMap: roughnessTexture,
          transparent: false,
        }),
      ] as const;

      playmatMaterial.forEach((mat) => {
        mat.polygonOffset = true;
        mat.polygonOffsetFactor = 1;
        mat.polygonOffsetUnits = 1;
      });

      playmatCache.set(key, playmatMaterial);
    }
    super(playmatGeo, playmatMaterial);

    this.receiveShadow = true;
    this.castShadow = true;
    this.name = name;
  }
}
