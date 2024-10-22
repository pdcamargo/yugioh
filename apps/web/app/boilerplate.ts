import {
  AmbientLightComponent,
  DirectionalLightComponent,
  Game,
  GameObject,
  HemisphereLightComponent,
} from "@repo/engine";
import * as THREE from "@repo/three";

import { World } from "./game/world";
import { SceneLights, Stadium } from "./match";
import { DeckComponent } from "./yugioh/components/deck";
import { FieldComponent } from "./yugioh/components/field";
import { HandComponent } from "./yugioh/components/hand";
import { LinkZoneComponent } from "./yugioh/components/link-zone";
import { OpponentHandComponent } from "./yugioh/components/opponent-hand";
import { CardGameObject, OutlineGameObject } from "./yugioh/game-objects";

export async function boilerplate() {
  const game = new Game();

  const loadingDiv = document.createElement("div");

  loadingDiv.style.position = "fixed";
  loadingDiv.style.inset = "0";
  loadingDiv.style.backgroundColor = "black";
  loadingDiv.style.color = "white";
  loadingDiv.style.display = "flex";
  loadingDiv.style.justifyContent = "center";
  loadingDiv.style.alignItems = "center";
  loadingDiv.style.zIndex = "9999";
  loadingDiv.style.fontSize = "2rem";
  loadingDiv.style.pointerEvents = "none";
  loadingDiv.innerText = "Loading...";

  loadingDiv.classList.add("spinner");

  document.body.appendChild(loadingDiv);

  await game.init({
    preload: {
      gltfs: ["/stadium2.glb"],
      hdrs: ["/billiard_hall_1k.hdr"],
      textures: [
        "/playmat/1.jpg",
        "/outline.png",
        "/card-masks/foils/secret-rare.png",
        "/holo.webp",
        "/cards/back.jpg",
        "/cards/24094653.jpg",
        "/cards/54912977.jpg",
        "/cards/68468459.jpg",
        "/cards/89631139.jpg",
      ],
      fonts: ["/fonts/Roboto Medium_Regular.json"],
    },
  });

  game.debug = true;

  // game.root.addComponent(SceneLights);
  const dl = game.root.addComponent(DirectionalLightComponent);

  dl.intensity = 2;
  dl.color = new THREE.Color("#757575");
  dl.position.set(0, 10, 0);
  dl.target.position.set(2.1, 0, 2.7);
  dl.castShadow = true;
  dl.shadow.mapSize.width = 2048 * 2;
  dl.shadow.mapSize.height = 2048 * 2;
  dl.shadow.camera.near = 0.01;
  dl.shadow.camera.far = 5000;

  const al = game.root.addComponent(AmbientLightComponent);

  al.intensity = 0.4;

  const skyColor = new THREE.Color("#ebfaff");
  const groundColor = new THREE.Color("#86f2dc");

  const hl = game.root.addComponent(HemisphereLightComponent);

  hl.skyColor = skyColor;
  hl.groundColor = groundColor;

  const stadium = new Stadium("stadium", game);

  stadium.transform.position.x =
    OutlineGameObject.calculatePlaymatSize().width / 4;
  stadium.transform.position.z =
    -OutlineGameObject.calculatePlaymatSize().height;

  game.addGameObject(stadium);

  const card = new CardGameObject("Blue-Eyes White Dragon", game, {
    mainTexture: await game.loadTexture("/images/cards/89631139.jpg"),
    foilTexture: await game.loadTexture("/secret-rare-foil.jpg"),
    maskTexture: await game.loadTexture("/card-masks/cards/89631139.png"),
    foilColorTexture: await game.loadTexture(
      "/secret-rare-foil-color-pattern.jpg",
    ),
  });

  const blueEyes = new CardGameObject("Blue-Eyes White Dragon", game, {
    mainTexture: await game.loadTexture("/cards/89631139.jpg"),
    foilTexture: await game.loadTexture("/prismatic-foil.jpg"),
    maskTexture: await game.loadTexture("/card-masks/cards/89631139.png"),
    foilColorTexture: await game.loadTexture("/prismatic-foil-glitter.jpg"),
  });

  const blueEyes2 = new CardGameObject("Blue-Eyes White Dragon", game, {
    mainTexture: await game.loadTexture("/cards/89631139.jpg"),
    foilTexture: await game.loadTexture("/card-masks/foils/blotches.jpg"),
    maskTexture: await game.loadTexture("/card-masks/cards/89631139.png"),
    foilColorTexture: await game.loadTexture("/ramp-1.jpg"),
  });

  const ancientLamp = new CardGameObject("Ancient Lamp", game, {
    mainTexture: await game.loadTexture("/cards/54912977.jpg"),
    foilTexture: await game.loadTexture("/card-masks/cards/54912977-foil.png"),
    maskTexture: await game.loadTexture("/card-masks/cards/54912977.png"),
    foilColorTexture: await game.loadTexture("/ramp-1.jpg"),
  });

  const fallenOfAlbaz = new CardGameObject("Fallen of Albaz", game, {
    mainTexture: await game.loadTexture("/cards/68468459.jpg"),
    foilTexture: await game.loadTexture("/holo.webp"),
    maskTexture: await game.loadTexture("/card-masks/cards/68468459.png"),
    foilColorTexture: await game.loadTexture("/ramp-1.jpg"),
  });

  const fallenOfAlbaz2 = new CardGameObject("Fallen of Albaz", game, {
    mainTexture: await game.loadTexture("/cards/68468459.jpg"),
    foilTexture: await game.loadTexture("/holo.webp"),
    maskTexture: await game.loadTexture("/card-masks/cards/68468459.png"),
    foilColorTexture: await game.loadTexture("/ramp-1.jpg"),
  });

  const polymerization = new CardGameObject("Polymerization", game, {
    mainTexture: await game.loadTexture("/cards/24094653.jpg"),
    foilTexture: await game.loadTexture("/card-masks/cards/24094653-foil.png"),
    maskTexture: await game.loadTexture("/card-masks/basic.png"),
    foilColorTexture: await game.loadTexture("/ramp-1.jpg"),
  });

  const field = game.createGameObject("Field");
  const fieldOp = game.createGameObject("Oponnent Field");

  const linkZone = game.createGameObject("Link Zone");
  const lz = linkZone.addComponent(LinkZoneComponent);

  linkZone.addChild(fallenOfAlbaz2);

  lz.setMonsterCard(0, fallenOfAlbaz2, "opponent", false);

  const fc = field.addComponent(FieldComponent);
  const fcOp = fieldOp.addComponent(FieldComponent);

  fc.playmatTexture = await game.loadTexture("/playmat/1.jpg");
  fc.playmatNormalTexture = await game.loadTexture("/noise-normal.jpg");
  fcOp.playmatTexture = await game.loadTexture("/playmat/2.jpeg");
  fcOp.playmatNormalTexture = await game.loadTexture("/noise-normal.jpg");

  field.transform.rotation.x = -Math.PI / 2;
  fieldOp.transform.rotation.x = Math.PI / 2;

  fieldOp.transform.rotation.y = Math.PI;

  linkZone.transform.rotation.x = -Math.PI / 2;

  OutlineGameObject.moveVectorInOutlineUnits(fieldOp.transform.position, {
    x: 4,
    y: 0,
    z: -4,
  });
  // linkZone.transform.position.z = -2.5;
  OutlineGameObject.moveVectorInOutlineUnits(linkZone.transform.position, {
    x: 1.5,
    y: 0,
    z: -2,
  });

  const opGui = game.gui.addFolder("Opponent playmat");

  const possibleCards = {
    polymerization: async () =>
      new CardGameObject("Polymerization", game, {
        mainTexture: await game.loadTexture("/cards/24094653.jpg"),
        foilTexture: await game.loadTexture(
          "/card-masks/cards/24094653-foil.png",
        ),
        maskTexture: await game.loadTexture("/card-masks/basic.png"),
        foilColorTexture: await game.loadTexture("/ramp-1.jpg"),
      }),
    "Blue-Eyes White Dragon": async () =>
      new CardGameObject("Blue-Eyes White Dragon", game, {
        mainTexture: await game.loadTexture("/cards/89631139.jpg"),
        foilTexture: await game.loadTexture(
          "/card-masks/foils/secret-rare.png",
        ),
        maskTexture: await game.loadTexture("/card-masks/cards/89631139.png"),
        foilColorTexture: await game.loadTexture("/ramp-1.jpg"),
      }),
    "Ancient Lamp": async () =>
      new CardGameObject("Ancient Lamp", game, {
        mainTexture: await game.loadTexture("/cards/54912977.jpg"),
        foilTexture: await game.loadTexture(
          "/card-masks/cards/54912977-foil.png",
        ),
        maskTexture: await game.loadTexture("/card-masks/cards/54912977.png"),
        foilColorTexture: await game.loadTexture("/ramp-1.jpg"),
      }),
    "Fallen of Albaz": async () =>
      new CardGameObject("Fallen of Albaz", game, {
        mainTexture: await game.loadTexture("/cards/68468459.jpg"),
        foilTexture: await game.loadTexture("/holo.webp"),
        maskTexture: await game.loadTexture("/card-masks/cards/68468459.png"),
        foilColorTexture: await game.loadTexture("/ramp-1.jpg"),
      }),
  };

  window.addCardInHand = async (to: string = "me") => {
    const randomKey = Object.keys(possibleCards)[
      Math.floor(Math.random() * Object.keys(possibleCards).length)
    ] as keyof typeof possibleCards;

    const c = await possibleCards[randomKey]();

    if (to === "me") {
      handObj.addChild(c);
      hc.addCard(c);
    } else {
      opHandObj.addChild(c);
      ohc.addCard(c);
    }
  };

  window.shuffleHand = (to: string = "me") => {
    if (to === "me") {
      hc.shuffle();
    } else {
      ohc.shuffle();
    }
  };

  window.shuffleDeck = (to: string = "me") => {
    if (to === "me") {
      dc.shuffle();
    } else {
      opDc.shuffle();
    }
  };

  fieldOp.addChild(card);
  field.addChild(
    ancientLamp,
    fallenOfAlbaz,
    blueEyes,
    blueEyes2,
    polymerization,
  );

  fcOp.setMonsterCard(0, card, false);
  fc.setMonsterCard(1, ancientLamp, false);
  fc.setMonsterCard(2, fallenOfAlbaz, false);
  fc.setMonsterCard(3, blueEyes, false);
  fc.setMonsterCard(4, blueEyes2, false);

  fc.setSpellCard(0, polymerization, false);

  const handObj = game.createGameObject("Hand");
  const opHandObj = game.createGameObject("Opponent Hand");

  handObj.transform.position.y = 1;
  handObj.transform.position.x =
    OutlineGameObject.calculatePlaymatSize().width / 4 + 59 / 150 / 2;

  handObj.transform.position.z = 0.55;
  handObj.transform.rotation.x = -Math.PI / 2;

  opHandObj.transform.position.y = 1;
  opHandObj.transform.position.x =
    OutlineGameObject.calculatePlaymatSize().width / 4 + 59 / 150 / 2;

  opHandObj.transform.position.z = -2.5;
  opHandObj.transform.rotation.x = -Math.PI / 2;

  const hc = handObj.addComponent(HandComponent);
  const ohc = opHandObj.addComponent(OpponentHandComponent);

  const handPosGui = game.gui.addFolder("Hand position");

  handPosGui.add(handObj.transform.position, "x", -10, 10);
  handPosGui.add(handObj.transform.position, "y", -10, 10);
  handPosGui.add(handObj.transform.position, "z", -10, 10);

  const opHandPosGui = game.gui.addFolder("Opponent Hand position");

  opHandPosGui.add(opHandObj.transform.position, "x", -10, 10);
  opHandPosGui.add(opHandObj.transform.position, "y", -10, 10);
  opHandPosGui.add(opHandObj.transform.position, "z", -10, 10);

  const deck = new GameObject("Deck", game);
  const opDeck = new GameObject("Opponent Deck", game);

  const dc = deck.addComponent(DeckComponent);
  const opDc = opDeck.addComponent(DeckComponent);

  const createDeck = async (length = 40) => {
    const cards: CardGameObject[] = [];

    for (let i = 0; i < length; i++) {
      const randomKey = Object.keys(possibleCards)[
        Math.floor(Math.random() * Object.keys(possibleCards).length)
      ] as keyof typeof possibleCards;

      const c = await possibleCards[randomKey]();

      cards.push(c);
    }

    return cards;
  };

  dc.setDeck(await createDeck());
  opDc.setDeck(await createDeck());

  field.addChild(deck);
  fieldOp.addChild(opDeck);

  OutlineGameObject.moveVectorInOutlineUnits(deck.transform.position, {
    x: 5,
    y: 0,
    z: 0,
  });

  OutlineGameObject.moveVectorInOutlineUnits(opDeck.transform.position, {
    x: 5,
    y: 0,
    z: 0,
  });

  const extraDeck = new GameObject("Extra Deck", game);
  const opExtraDeck = new GameObject("Opponent Extra Deck", game);

  deck.transform.position.z = -0.015;
  opDeck.transform.position.z = -0.015;
  extraDeck.transform.position.z = -0.015;
  opExtraDeck.transform.position.z = -0.015;

  const edc = extraDeck.addComponent(DeckComponent);
  const opEdc = opExtraDeck.addComponent(DeckComponent);

  edc.setDeck(await createDeck(15));
  opEdc.setDeck(await createDeck(15));

  field.addChild(extraDeck);
  fieldOp.addChild(opExtraDeck);

  OutlineGameObject.moveVectorInOutlineUnits(extraDeck.transform.position, {
    x: -1,
    y: 0,
    z: 0,
  });

  OutlineGameObject.moveVectorInOutlineUnits(opExtraDeck.transform.position, {
    x: -1,
    y: 0,
    z: 0,
  });

  const environment = game.getHDR("/billiard_hall_1k.hdr")!;

  game.scene.environment = environment;
  game.scene.background = environment;

  game.start();

  document.body.removeChild(loadingDiv);
  // const world = new World({
  //   players: [
  //     {
  //       id: "1",
  //       name: "Player 1",
  //     },
  //     {
  //       id: "1",
  //       name: "Player 1",
  //     },
  //   ],
  // });

  // world.init();
}
