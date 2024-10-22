import { Component, gsap } from "@repo/engine";

import { CARD_DIMENSIONS, CardGameObject } from "../game-objects";

export class DeckComponent extends Component {
  cards: CardGameObject[] = [];

  public override startup() {
    this.arrangeDeck();
  }

  public setDeck(cards: CardGameObject[]) {
    this.cards = cards;
    this.arrangeDeck();
  }

  private arrangeDeck() {
    this.cards.forEach((card, index) => {
      card.transform.position.z = index * (CARD_DIMENSIONS.depth / 2);

      card.toFaceDown(false);

      card.setParent(this.gameObject);
    });
  }

  addCard(card: CardGameObject) {
    this.cards.push(card);
    this.arrangeDeck();
  }

  removeCard(card: CardGameObject) {
    const index = this.cards.indexOf(card);
    if (index === -1) {
      return;
    }

    const [c] = this.cards.splice(index, 1);

    this.arrangeDeck();

    return c;
  }

  shuffle(newDeckOrder: CardGameObject[] = []) {
    const originalDeckOrder = this.cards.slice();

    const half = Math.ceil(this.cards.length / 2);
    const topHalf = this.cards.slice(0, half);
    const bottomHalf = this.cards.slice(half);
    const duration = 0.55;

    const halfDeckHeight = half * (CARD_DIMENSIONS.depth / 2);

    const timeline = gsap.timeline({ repeat: 2, yoyo: false }); // Repeat 3 times in total

    // Step 1: Slide both halves slightly up and down to simulate shuffle separation (simultaneously)
    timeline.to(
      bottomHalf.map((card) => card.transform.position),
      {
        y: "+=0.3",
        duration: duration / 3,
        ease: "power1.inOut",
      },
    );

    timeline.to(
      topHalf.map((card) => card.transform.position),
      {
        y: "-=0.3",
        duration: duration / 3,
        ease: "power1.inOut",
      },
      "<",
    ); // Run at the same time as the previous step

    // Step 2: Move bottom half forward and top half back to simulate interleave (simultaneously after Step 1)
    timeline.to(
      bottomHalf.map((card) => card.transform.position),
      {
        z: `-=${halfDeckHeight}`,
        duration: duration / 3,
        ease: "power1.inOut",
      },
    );

    timeline.to(
      topHalf.map((card) => card.transform.position),
      {
        z: `+=${halfDeckHeight}`,
        duration: duration / 3,
        ease: "power1.inOut",
      },
      "<",
    ); // Run at the same time as the previous step

    // Step 3: Move both halves back to align in their new shuffled position (simultaneously)
    timeline.to(
      this.cards.map((card) => card.transform.position),
      {
        y: 0,
        duration: duration / 3,
        ease: "power1.inOut",
        onComplete: () => {
          (this.cards =
            newDeckOrder.length === 0 ? originalDeckOrder : newDeckOrder),
            this.arrangeDeck();
        },
      },
    );
  }
}
