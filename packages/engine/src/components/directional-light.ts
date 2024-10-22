import * as THREE from "@repo/three";

import { Component, Game, GameObject } from "../game";

export class DirectionalLightComponent extends Component {
  #directionalLight: THREE.DirectionalLight;

  #helper: THREE.DirectionalLightHelper;

  constructor(name: string, game: Game, gameObject: GameObject) {
    super(name || "DirectionalLightComponent", game, gameObject);

    this.#directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

    this.#helper = new THREE.DirectionalLightHelper(this.#directionalLight, 20);
    this.gameObject.transform.add(this.#helper);
  }

  public override startup(): void {
    this.gameObject.transform.add(this.#directionalLight);
    this.gameObject.transform.add(this.#directionalLight.target);

    const dl = this.game.gui.addFolder("Directional Light");

    dl.close();

    dl.add(this.#directionalLight, "intensity", 0, 5).name("Intensity");
    dl.addColor(this.#directionalLight, "color").name("Color");

    const pos = dl.addFolder("Position");
    pos.close();

    pos.add(this.#directionalLight.position, "x", -30, 30, 0.05);
    pos.add(this.#directionalLight.position, "y", -30, 30, 0.05);
    pos.add(this.#directionalLight.position, "z", -30, 30, 0.05);

    const rot = dl.addFolder("Rotation");
    rot.close();

    rot.add(this.#directionalLight.rotation, "x", -Math.PI, Math.PI, 0.05);
    rot.add(this.#directionalLight.rotation, "y", -Math.PI, Math.PI, 0.05);
    rot.add(this.#directionalLight.rotation, "z", -Math.PI, Math.PI, 0.05);

    const target = dl.addFolder("Target");
    target.close();
    const targetPos = target.addFolder("Position");

    targetPos.add(this.#directionalLight.target.position, "x", -30, 30, 0.05);
    targetPos.add(this.#directionalLight.target.position, "y", -30, 30, 0.05);
    targetPos.add(this.#directionalLight.target.position, "z", -30, 30, 0.05);

    const targetRot = target.addFolder("Rotation");

    targetRot.add(
      this.#directionalLight.target.rotation,
      "x",
      -Math.PI,
      Math.PI,
      0.05,
    );
    targetRot.add(
      this.#directionalLight.target.rotation,
      "y",
      -Math.PI,
      Math.PI,
      0.05,
    );
    targetRot.add(
      this.#directionalLight.target.rotation,
      "z",
      -Math.PI,
      Math.PI,
      0.05,
    );

    dl.add(this.#directionalLight, "castShadow").name("Cast Shadow");

    const shadow = dl.addFolder("Shadow");
    shadow.close();

    shadow.add(
      this.#directionalLight.shadow.mapSize,
      "width",
      512,
      2048 * 2,
      512,
    );
    shadow.add(
      this.#directionalLight.shadow.mapSize,
      "height",
      512,
      2048 * 2,
      512,
    );

    this.#helper.visible = this.game.debug;

    this.game.on("debug-mode", (isDebug) => {
      if (this.#helper) {
        this.#helper.visible = isDebug;
      }
    });
  }

  public get target() {
    return this.#directionalLight.target;
  }

  public get shadow() {
    return this.#directionalLight.shadow;
  }

  public get castShadow() {
    return this.#directionalLight.castShadow;
  }

  public set castShadow(value: boolean) {
    this.#directionalLight.castShadow = value;
  }

  public get targetPosition() {
    return this.#directionalLight.target.position;
  }

  public set targetPosition(value: THREE.Vector3) {
    this.#directionalLight.target.position.copy(value);
  }

  public get targetRotation() {
    return this.#directionalLight.target.rotation;
  }

  public set targetRotation(value: THREE.Euler) {
    this.#directionalLight.target.rotation.copy(value);
  }

  public get position() {
    return this.#directionalLight.position;
  }

  public set position(value: THREE.Vector3) {
    this.#directionalLight.position.copy(value);
  }

  public get rotation() {
    return this.#directionalLight.rotation;
  }

  public set rotation(value: THREE.Euler) {
    this.#directionalLight.rotation.copy(value);
  }

  public get intensity() {
    return this.#directionalLight.intensity;
  }

  public set intensity(value: number) {
    this.#directionalLight.intensity = value;
  }

  public get color() {
    return this.#directionalLight.color;
  }

  public set color(value: THREE.Color) {
    this.#directionalLight.color = value;
  }
}
