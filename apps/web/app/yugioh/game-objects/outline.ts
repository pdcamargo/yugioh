import { EntityEvent, Game, GameObject } from "@repo/engine";
import * as THREE from "@repo/three";

import { CARD_DIMENSIONS } from "./card";

export class OutlineGameObject extends GameObject<THREE.Mesh> {
  static OUTLINE_SCALE_X = 1.1;
  static OUTLINE_SCALE_Y = 1.05;

  constructor(name: string, game: Game) {
    const outlineTexture = game.getTexture("/outline.png")!;

    const boxGeometry = new THREE.BoxGeometry(
      CARD_DIMENSIONS.height * OutlineGameObject.OUTLINE_SCALE_X,
      CARD_DIMENSIONS.height * OutlineGameObject.OUTLINE_SCALE_Y,
      0.005,
    ); // The size of the box
    const mesh = new THREE.Mesh(
      boxGeometry,
      new THREE.MeshBasicMaterial({
        map: outlineTexture,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        // yellow
        color: new THREE.Color(0xffff00),
      }),
    );

    mesh.castShadow = false;
    mesh.receiveShadow = true;

    mesh.position.z = -0.015;

    super(name, game, mesh);
  }

  moveUnits(unit: THREE.Vector2Like) {
    OutlineGameObject.moveVectorInOutlineUnits(this.transform.position, unit);
  }

  set color(color: THREE.Color) {
    if (this.transform.material instanceof THREE.MeshBasicMaterial) {
      this.transform.material.color = color;
    }
  }

  static moveVectorInOutlineUnits(
    vector: THREE.Vector3,
    unity: THREE.Vector2Like | THREE.Vector3Like,
  ) {
    vector.x +=
      CARD_DIMENSIONS.height * OutlineGameObject.OUTLINE_SCALE_X * unity.x;
    vector.y +=
      CARD_DIMENSIONS.height * OutlineGameObject.OUTLINE_SCALE_Y * unity.y;

    if ("z" in unity) {
      vector.z +=
        CARD_DIMENSIONS.height * OutlineGameObject.OUTLINE_SCALE_Y * unity.z;
    }
  }

  static calculatePlaymatSize() {
    // 5 cards + deck + extra deck size for width
    // 2 cards + half size for link zone for height
    // For zed, it doesn't really matter
    const x = CARD_DIMENSIONS.height * 7 * OutlineGameObject.OUTLINE_SCALE_X;
    const y = CARD_DIMENSIONS.height * 2.5 * OutlineGameObject.OUTLINE_SCALE_Y;

    return new THREE.Vector2(x, y);
  }
}
