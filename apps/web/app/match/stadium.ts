import { Game, GameObject } from "@repo/engine";
import * as THREE from "@repo/three";


export class Stadium extends GameObject<THREE.Group> {
  constructor(name: string, game: Game) {
    const { scene: stadiumModel } = game.getGLTF("/stadium2.glb")!;

    stadiumModel.scale.set(0.05, 0.05, 0.05);
    stadiumModel.position.set(0, -0.1, 0);

    super(name, game, stadiumModel);
  }
}
