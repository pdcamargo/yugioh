import { Component, gsap } from "@repo/engine";
import * as THREE from "@repo/three";

import { CardGameObject, OutlineGameObject } from "../game-objects";

export class LinkZoneComponent extends Component {
  public override startup() {
    for (let i = 0; i < 2; i++) {
      const monsterOutline = new OutlineGameObject(
        "Link Monster " + i,
        this.game,
      );

      monsterOutline.moveUnits({
        x: i,
        y: 0,
      });

      this.gameObject.addChild(monsterOutline);

      monsterOutline.color = new THREE.Color(0x00ffff);
    }
  }

  monsterCards: CardGameObject[] = [];

  setMonsterCard(
    index: number,
    card: CardGameObject,
    owner: "me" | "opponent" = "me",
    animate = false,
  ) {
    if (this.monsterCards[index]) {
      // return; // TODO: figure out what we want to do here
    }

    const targetPos = new THREE.Vector3();

    OutlineGameObject.moveVectorInOutlineUnits(targetPos, { x: index, y: 0 });

    if (owner === "opponent") {
      card.transform.scale.set(-1, -1, 1);
    }

    card.transform.position.z = 0.05;

    if (animate) {
      gsap.to(card.transform.position, {
        x: targetPos.x,
        y: targetPos.y,
        duration: 0.5,
        ease: "power2.inOut",
      });
    } else {
      card.transform.position.copy(targetPos);
    }

    this.monsterCards[index] = card;
  }
}
