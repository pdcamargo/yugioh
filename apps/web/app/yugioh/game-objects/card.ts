import { EntityEvent, Game, GameObject, gsap } from "@repo/engine";
import * as THREE from "@repo/three";

import fragmentShader from "../shaders/basic-foil.frag";
import vertexShader from "../shaders/tangent.vert";

export const CARD_DIMENSIONS = {
  width: 59 / 150,
  height: 86 / 150,
  depth: 1 / 150,
  segments: 10,
  radius: 4,
};

const cardGeo = new THREE.RoundedBoxGeometry(
  CARD_DIMENSIONS.width,
  CARD_DIMENSIONS.height,
  CARD_DIMENSIONS.depth,
  CARD_DIMENSIONS.segments,
  CARD_DIMENSIONS.radius,
);

const frontNormalMat = new THREE.MeshPhysicalMaterial({
  side: THREE.FrontSide,
});

const backMat = new THREE.MeshPhysicalMaterial({
  side: THREE.DoubleSide, // Ensure the back face is rendered correctly
});

const sideMat = new THREE.MeshPhysicalMaterial({
  color: 0xaaaaaa, // A neutral color for the card's sides
  side: THREE.DoubleSide,
});

type FoilCardOptions = {
  mainTexture: THREE.Texture;
  maskTexture: THREE.Texture;
  foilTexture: THREE.Texture;
  foilColorTexture: THREE.Texture;
  backTexture?: THREE.Texture;
  brightPower?: number;
  colorDensity?: number;
  tiling?: THREE.Vector2;
  tangent?: THREE.Vector4;
  holoThreshold?: number;
};

type NormalCardOptions = {
  mainTexture: THREE.Texture;
  backTexture?: THREE.Texture;
};

type CardOptions = (FoilCardOptions | NormalCardOptions) & {
  isMouseInteractable?: boolean;
};

export class CardGameObject extends GameObject<THREE.Mesh, {}> {
  shaderMaterial?: THREE.ShaderMaterial;

  constructor(name: string, game: Game, options: CardOptions) {
    const geo = cardGeo.clone();

    let front: THREE.Material;

    const backTexture =
      options.backTexture || game.getTexture("/cards/back.jpg")!;

    backTexture.anisotropy = game.maxAnisotropy;

    if ("foilTexture" in options) {
      const { mainTexture, maskTexture, foilTexture, foilColorTexture } =
        options;

      mainTexture.anisotropy = game.maxAnisotropy;
      maskTexture.anisotropy = game.maxAnisotropy;
      foilTexture.anisotropy = game.maxAnisotropy;

      foilTexture.wrapS = THREE.RepeatWrapping;
      foilTexture.wrapT = THREE.RepeatWrapping;

      front = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          TIME: { value: 0 },

          colorDensity: { value: 4 },
          brightPower: { value: 1 },

          tiling: { value: new THREE.Vector2(1, 1) },
          tangent: { value: THREE.random01Vector4() },
          foilScale: { value: 1 },
          foilPattern: { value: foilTexture },
          mainTexture: { value: mainTexture },
          maskTexture: { value: maskTexture },
          colorPatternTexture: { value: foilColorTexture },
          lightBaseDirection: { value: THREE.random01Vector3() },
          lightMoveAmplitude: { value: THREE.randomFloat(0.41, 0.53) },
          lightSpeed: { value: THREE.randomFloat(0.75, 1) },
        },
        side: THREE.FrontSide,
      });

      // const cardFoilGui = game.gui.addFolder(`${name} Foil`);

      // cardFoilGui.close();

      // cardFoilGui
      //   .add((front as THREE.ShaderMaterial).uniforms.colorDensity, "value")
      //   .name("Color Density");
      // cardFoilGui
      //   .add((front as THREE.ShaderMaterial).uniforms.brightPower, "value")
      //   .name("Bright Power");
      // cardFoilGui
      //   .add((front as THREE.ShaderMaterial).uniforms.foilScale, "value")
      //   .name("Foil Scale");
      // cardFoilGui
      //   .add(
      //     (front as THREE.ShaderMaterial).uniforms.lightMoveAmplitude,
      //     "value",
      //   )
      //   .name("Light Move Amplitude");
      // cardFoilGui
      //   .add((front as THREE.ShaderMaterial).uniforms.lightSpeed, "value")
      //   .name("Light Speed");

      // const tilingGui = cardFoilGui.addFolder("Tiling");

      // tilingGui
      //   .add((front as THREE.ShaderMaterial).uniforms.tiling.value, "x")
      //   .name("X");
      // tilingGui
      //   .add((front as THREE.ShaderMaterial).uniforms.tiling.value, "y")
      //   .name("Y");

      if ("brightPower" in options) {
        (front as THREE.ShaderMaterial).uniforms.brightPower.value =
          options.brightPower;
      }

      if ("colorDensity" in options) {
        (front as THREE.ShaderMaterial).uniforms.colorDensity.value =
          options.colorDensity;
      }

      if ("tiling" in options) {
        (front as THREE.ShaderMaterial).uniforms.tiling.value = options.tiling;
      }

      if ("tangent" in options) {
        (front as THREE.ShaderMaterial).uniforms.tangent.value =
          options.tangent;
      }

      if ("holoThreshold" in options) {
        (front as THREE.ShaderMaterial).uniforms.holoThreshold.value =
          options.holoThreshold;
      }
    } else {
      front = frontNormalMat.clone();

      (front as THREE.MeshPhysicalMaterial).map = options.mainTexture;

      options.mainTexture.anisotropy = game.maxAnisotropy;
    }

    const back = backMat.clone();

    back.map = backTexture;

    const side = sideMat.clone();

    const materials = [side, side, side, side, front, back];

    const mesh = new THREE.Mesh(geo, materials);

    mesh.receiveShadow = true;
    mesh.castShadow = true;

    super(name, game, mesh, undefined, {
      isMouseInteractable: options?.isMouseInteractable,
    });

    if ("foilTexture" in options) {
      this.shaderMaterial = front as THREE.ShaderMaterial;
    }

    // const font = game.getFont("/fonts/Roboto Medium_Regular.json")!;

    // const geometry = new THREE.TextGeometry("3000/100", {
    //   font: font,
    //   size: 0.05,
    //   depth: 0.01,
    // });

    // const textMaterial = new THREE.MeshBasicMaterial({ color: 0xfafafa });

    // const text = new THREE.Mesh(geometry, textMaterial);

    // text.position.set(-0.25, -0.5, 0);

    // mesh.add(text);
  }

  update(): void {
    if (this.shaderMaterial) {
      this.shaderMaterial.uniforms.TIME.value = this.game.elapsedTime;
    }
  }

  toFaceDown(animated = true) {
    if (!animated) {
      this.transform.rotation.y = Math.PI;

      return;
    }

    gsap.to(this.transform.rotation, {
      y: Math.PI,
      duration: 0.5,
      ease: "power2.inOut",
    });
  }

  flip(animated = true) {
    if (!animated) {
      this.transform.rotation.y = this.isFaceDown ? 0 : Math.PI;

      return;
    }

    if (this.isFaceDown) {
      gsap.to(this.transform.rotation, {
        y: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(this.transform.rotation, {
        y: Math.PI,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }

  tap(animated = true) {
    const targetZ = this.isFaceDown ? Math.PI / 2 : -Math.PI / 2;

    if (!animated) {
      this.transform.rotation.x = this.isTap ? 0 : targetZ;

      return;
    }

    if (this.isTap) {
      gsap.to(this.transform.rotation, {
        z: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
    } else {
      gsap.to(this.transform.rotation, {
        z: targetZ,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }

  public get isTap() {
    return Math.abs(this.transform.rotation.z) > Math.PI / 4;
  }

  public get isUntap() {
    return Math.abs(this.transform.rotation.z) <= Math.PI / 4;
  }

  public get isFaceDown() {
    return this.transform.rotation.y > Math.PI / 2;
  }

  public get isFaceUp() {
    return this.transform.rotation.y <= Math.PI / 2;
  }
}
