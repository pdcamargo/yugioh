import { Component } from "@repo/engine";
import * as THREE from "@repo/three";


export class SceneLights extends Component {
  startup(): void {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 10, 0);
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.01;
    directionalLight.shadow.camera.far = 5000;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);

    // silver color
    const skyColor = new THREE.Color("#ebfaff");
    // light green ground color
    const groundColor = new THREE.Color("#86f2dc");

    const hemiLight = new THREE.HemisphereLight(skyColor, groundColor, 0.3);

    this.gameObject.transform.add(
      directionalLight,
      directionalLight.target,
      ambientLight,
      hemiLight,
    );

    const texture = this.game.getHDR("/billiard_hall_1k.hdr")!;

    texture.mapping = THREE.EquirectangularReflectionMapping;
    this.game.scene.environment = texture;
    this.game.scene.background = texture;
  }
}
