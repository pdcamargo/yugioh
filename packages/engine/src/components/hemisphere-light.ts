import * as THREE from "@repo/three";

import { Component, Game, GameObject } from "../game";

export class HemisphereLightComponent extends Component {
  #ambientLight: THREE.HemisphereLight;

  #helper: THREE.HemisphereLightHelper;

  constructor(name: string, game: Game, gameObject: GameObject) {
    super(name || "HemisphereLightComponent", game, gameObject);

    this.#ambientLight = new THREE.HemisphereLight(0xffffff, 0.4);

    this.#helper = new THREE.HemisphereLightHelper(this.#ambientLight, 20);

    this.gameObject.transform.add(this.#helper);
  }

  public override startup(): void {
    this.gameObject.transform.add(this.#ambientLight);

    const al = this.game.gui.addFolder("Hemisphere Light");

    al.close();

    al.add(this.#ambientLight, "intensity", 0, 5).name("Intensity");
    al.addColor(this.#ambientLight, "color").name("Sky Color");
    al.addColor(this.#ambientLight, "groundColor").name("Ground Color");

    this.#helper.visible = this.game.debug;

    this.game.on("debug-mode", (debug: boolean) => {
      this.#helper.visible = debug;
    });
  }

  public get intensity(): number {
    return this.#ambientLight.intensity;
  }

  public set intensity(value: number) {
    this.#ambientLight.intensity = value;
  }

  public get skyColor() {
    return this.#ambientLight.color;
  }

  public set skyColor(value: THREE.Color) {
    this.#ambientLight.color = value;
  }

  public get groundColor() {
    return this.#ambientLight.groundColor;
  }

  public set groundColor(value: THREE.Color) {
    this.#ambientLight.groundColor = value;
  }
}
