// export enum CardEffectType {
//   // Event types effect
//   /**
//    * This effect is for when this card is drawn from the deck.
//    */
//   DRAWN,
//   /**
//    * This effect is for when this card is played from the hand.
//    *
//    * For monsters, this means they are summoned and have an immediate effect.
//    *
//    * For spells, this means they are activated.
//    */
//   PLAYED,
//   /**
//    * This effect is for when this card is discarded from the hand.
//    */
//   DISCARDED,
//   /**
//    * This effect is for when this card is destroyed from the field.
//    */
//   DESTROYED,
//   /**
//    * This effect is for when the card is targeted by an effect.
//    *
//    * This means any targeting effect, it's not specific to a type of card or who is targeting it.
//    */
//   TARGETED,
//   /**
//    * Same as `TARGETED`, but specifically by the opponent.
//    */
//   TARGETED_BY_OPPONENT,
//   /**
//    * Same as `TARGETED`, but specifically by an ally.
//    */
//   TARGETED_BY_ALLY,
//   /**
//    * Same as `TARGETED_BY_OPPONENT`, but specifically by a monster effect.
//    */
//   TARGETED_BY_OPPONENT_MONSTER,
//   /**
//    * Same as `TARGETED_BY_OPPONENT`, but specifically by a spell effect.
//    */
//   TARGETED_BY_OPPONENT_SPELL,
//   FLIPPED,
//   TRIBUTTED,

//   // Action types effect
//   ACTIVE,
//   DRAW,
// }

export enum MatchPhase {
  DRAW,
  STANDBY,
  MAIN_1,
  BATTLE_START,
  BATTLE_STEP,
  BATTLE_DAMAGE,
  BATTLE_END,
  MAIN_2,
  END,
}

export class Player {
  lifePoints = 8000;

  constructor(
    public id: string,
    public name: string,
    public match: Match,
  ) {}

  public get opponent(): Player {
    return this.match.getOpponentFor(this);
  }

  public get isMyTurn(): boolean {
    return this.match.isPlayerTurn(this);
  }

  public draw(amount: number) {}
  public heal(amount: number) {}
  public damage(amount: number) {}
}

export class Match {
  players: Player[] = [];

  phase: MatchPhase = MatchPhase.STANDBY;

  currentTurnPlayerId: string = "";

  public getOpponentFor(player: Player): Player {
    return this.players.find((p) => p.id !== player.id)!;
  }

  public isPlayerTurn(player: Player): boolean {
    return player.id === this.currentTurnPlayerId;
  }
}

export abstract class CardEffect {
  abstract apply(
    match: Match,
    me: Player,
    opponent: Player,
  ): void | Promise<void>;
}

export class DrawEffect extends CardEffect {
  constructor(public amount: number) {
    super();
  }

  apply(match: Match, me: Player, opponent: Player) {
    me.draw(this.amount);
  }
}

export class HealEffect extends CardEffect {
  constructor(public amount: number) {
    super();
  }

  apply(match: Match, me: Player, opponent: Player) {
    me.heal(this.amount);
  }
}

export class DamageEffect extends CardEffect {
  constructor(
    public amount: number,
    public target: "me" | "opponent" = "opponent",
  ) {
    super();
  }

  apply(match: Match, me: Player, opponent: Player) {
    if (this.target === "me") {
      me.damage(this.amount);
    } else {
      opponent.damage(this.amount);
    }
  }
}

export abstract class CardCondition {
  abstract check(
    match: Match,
    me: Player,
    opponent: Player,
  ): boolean | Promise<boolean>;
}

export class LifePointsCondition extends CardCondition {
  constructor(
    public amount: number,
    public target: "me" | "opponent" = "me",
  ) {
    super();
  }

  check(match: Match, me: Player, opponent: Player) {
    if (this.target === "me") {
      return me.lifePoints <= this.amount;
    } else {
      return opponent.lifePoints <= this.amount;
    }
  }
}

export class TurnPhaseCondition extends CardCondition {
  constructor(public phases: MatchPhase | MatchPhase[]) {
    super();
  }

  check(match: Match, me: Player, opponent: Player) {
    // if phases is an array, it's an or
    if (Array.isArray(this.phases)) {
      return this.phases.some((phase) => match.phase === phase);
    }

    return match.phase === this.phases;
  }
}

export class MyTurnCondition extends CardCondition {
  check(match: Match, me: Player, opponent: Player) {
    return me.isMyTurn;
  }
}

export class OpponentTurnCondition extends CardCondition {
  check(match: Match, me: Player, opponent: Player) {
    return opponent.isMyTurn;
  }
}

/**
 * Combines multiple conditions into a single condition.
 */
export function withConditions(...conditions: CardCondition[]) {
  return (match: Match, me: Player, opponent: Player) => {
    return conditions.every((condition) =>
      condition.check(match, me, opponent),
    );
  };
}

export * from "./game";
export * from "./components";
export * from "gsap";