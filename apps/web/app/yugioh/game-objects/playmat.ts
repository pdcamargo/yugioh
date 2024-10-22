import { Game, GameObject } from "@repo/engine";
import * as THREE from "@repo/three";

import { OutlineGameObject } from "./outline";

export type PlaymatGameObjectOptions = {
  texture: THREE.Texture;
  normalTexture?: THREE.Texture;
};

export class PlaymatGameObject extends GameObject<THREE.Mesh> {
  constructor(name: string, game: Game, options: PlaymatGameObjectOptions) {
    const playmatSize = OutlineGameObject.calculatePlaymatSize();
    const geo = new THREE.RoundedBoxGeometry(
      playmatSize.x,
      playmatSize.y + 0.1,
      0.01,
      10,
      4,
    );

    const frontMat = new THREE.MeshPhysicalMaterial({
      map: options.texture,
      normalMap: options.normalTexture,
    });

    const backMat = new THREE.MeshPhysicalMaterial();
    const sidesMat = new THREE.MeshPhysicalMaterial();

    const mats = [sidesMat, sidesMat, sidesMat, sidesMat, frontMat, backMat];

    const mesh = new THREE.Mesh(geo, mats);

    mesh.receiveShadow = true;
    mesh.castShadow = false;

    super(name, game, mesh);
  }
}
