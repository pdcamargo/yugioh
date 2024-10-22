import { Component, GameObject, gsap } from "@repo/engine";
import * as THREE from "@repo/three";

import {
  CardGameObject,
  OutlineGameObject,
  PlaymatGameObject,
} from "../game-objects";

export class FieldComponent extends Component {
  playmatTexture?: THREE.Texture;
  playmatNormalTexture?: THREE.Texture;

  public override startup() {
    for (let i = 0; i < 5; i++) {
      const monsterOutline = new OutlineGameObject("Monster " + i, this.game);

      monsterOutline.moveUnits({
        x: i,
        y: 0,
      });

      this.gameObject.addChild(monsterOutline);

      monsterOutline.color = new THREE.Color(0xff0000);

      const spellOutline = new OutlineGameObject("Spell " + i, this.game);

      spellOutline.moveUnits({
        x: i,
        y: 1,
      });

      this.gameObject.addChild(spellOutline);

      spellOutline.color = new THREE.Color(0x00ff00);
    }

    const playmat = new PlaymatGameObject("Playmat", this.game, {
      normalTexture:
        this.playmatNormalTexture || this.game.getTexture("/playmat/1.jpg")!,
      texture: this.playmatTexture || this.game.getTexture("/playmat/1.jpg")!,
    });

    playmat.transform.position.z = -0.02;

    OutlineGameObject.moveVectorInOutlineUnits(playmat.transform.position, {
      x: 2,
      y: 0.675,
    });

    this.gameObject.addChild(playmat);
  }

  monsterCards: CardGameObject[] = [];
  spellCards: CardGameObject[] = [];

  setMonsterCard(index: number, card: CardGameObject, animate = false) {
    if (this.monsterCards[index]) {
      // return; // TODO: figure out what we want to do here
    }

    const targetPos = new THREE.Vector3();

    OutlineGameObject.moveVectorInOutlineUnits(targetPos, { x: index, y: 1 });

    card.transform.position.z = -0.05;

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

  setSpellCard(index: number, card: CardGameObject, animate = false) {
    if (this.spellCards[index]) {
      return; // TODO: figure out what we want to do here
    }

    const targetPos = new THREE.Vector3();

    OutlineGameObject.moveVectorInOutlineUnits(targetPos, { x: index, y: 0 });

    card.transform.position.z = -0.05;

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

    this.spellCards[index] = card;
  }
}
