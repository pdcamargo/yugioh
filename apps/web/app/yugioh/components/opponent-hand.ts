import { Component, gsap } from "@repo/engine";

import { CARD_DIMENSIONS, CardGameObject } from "../game-objects";

export class OpponentHandComponent extends Component {
  public cards: CardGameObject[] = [];

  public override startup(): void {
    this.handArrangement();
  }

  public addCard(card: CardGameObject) {
    this.cards.push(card);

    this.handArrangement();
  }

  public removeCard(card: CardGameObject) {
    const index = this.cards.indexOf(card);

    if (index >= 0) {
      this.cards.splice(index, 1);
    }

    this.handArrangement();
  }

  public get archWidth() {
    return CARD_DIMENSIONS.width * Math.min(this.cards.length, 7) * 0.75;
  }

  public get maxArchHeight() {
    return CARD_DIMENSIONS.height / 12;
  }

  private handArrangement() {
    const length = this.cards.length;
    if (length === 0) return;

    for (let i = 0; i < length; i++) {
      const card = this.cards[i];

      card.toFaceDown(false);
    }

    if (length === 1) {
      gsap.to(this.cards[0].transform.position, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
      });
      gsap.to(this.cards[0].transform.rotation, {
        z: 0,
        duration: 0.5,
      });
      return;
    }

    if (length === 2) {
      gsap.to(this.cards[0].transform.position, {
        x: -CARD_DIMENSIONS.width / 2,
        z: 0,
        duration: 0.5,
      });

      gsap.to(this.cards[1].transform.position, {
        x: CARD_DIMENSIONS.width / 2,
        z: 0.01,
        duration: 0.5,
      });

      return;
    }

    // Calculate spacing between cards along the X-axis
    const spacing = this.archWidth / (length - 1);

    for (let i = 0; i < length; i++) {
      const card = this.cards[i];

      // Calculate the rotation based on the position relative to the center
      const centerIndex = (length - 1) / 2;
      const offsetFromCenter = i - centerIndex;
      const rotationZ = -offsetFromCenter * 0.033; // Adjust the multiplier for desired inclination

      // Calculate the X position based on spacing
      const targetX = -this.archWidth / 2 + i * spacing;

      // Refine Y position calculation for a smoother visual effect
      const t = Math.abs(offsetFromCenter) / centerIndex; // Normalized position between 0 (center) and 1 (ends)
      const peakY = this.maxArchHeight * (1 - t * t); // Squared to smooth out the peak
      const targetY = -(peakY - Math.abs(rotationZ) * 0.1);

      const targetZ = 0.01 * i;

      gsap.to(card.transform.position, {
        x: targetX,
        y: targetY,
        z: targetZ,
        duration: 0.5,
      });

      gsap.to(card.transform.rotation, {
        z: rotationZ,
        duration: 0.5,
      });
    }
  }

  public shuffle() {
    this.cards.sort(() => Math.random() - 0.5);

    for (let i = 0; i < this.cards.length; i++) {
      gsap.to(this.cards[i].transform.position, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.3,
      });
      gsap.to(this.cards[i].transform.rotation, {
        z: 0,
        duration: 0.3,
        onComplete: () => {
          this.handArrangement();
        },
      });
    }
  }
}
