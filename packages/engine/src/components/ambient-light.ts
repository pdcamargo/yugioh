import * as THREE from "@repo/three";

import { Component, Game, GameObject } from "../game";

export class AmbientLightComponent extends Component {
  #ambientLight: THREE.AmbientLight;

  constructor(name: string, game: Game, gameObject: GameObject) {
    super(name || "AmbientLightComponent", game, gameObject);

    this.#ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  }

  public override startup(): void {
    this.gameObject.transform.add(this.#ambientLight);

    const al = this.game.gui.addFolder("Ambient Light");

    al.close();

    al.add(this.#ambientLight, "intensity", 0, 5).name("Intensity");
    al.addColor(this.#ambientLight, "color").name("Color");
  }

  public get intensity(): number {
    return this.#ambientLight.intensity;
  }

  public set intensity(value: number) {
    this.#ambientLight.intensity = value;
  }

  public get color() {
    return this.#ambientLight.color;
  }

  public set color(value: THREE.Color) {
    this.#ambientLight.color = value;
  }
}
