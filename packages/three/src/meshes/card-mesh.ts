import glsl from "glslify";
import {
  AdditiveBlending,
  BackSide,
  BoxGeometry,
  Color,
  Mesh,
  MeshPhysicalMaterial,
  ShaderMaterial,
  Texture,
  MeshStandardMaterial,
  PlaneGeometry,
  TextureLoader,
  Vector2,
  Vector3,
  DoubleSide,
  FrontSide,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader
// Fragment shader
// Fragment shader
const fragmentShader = glsl`
  uniform sampler2D mainTexture;
  uniform sampler2D maskTexture;
  uniform sampler2D holoTexture;
  uniform sampler2D gradientTexture;
  uniform float time;
  uniform float holoThreshold;

  varying vec2 vUv;

  void main() {
    vec4 mainColor = texture2D(mainTexture, vUv);
    vec4 maskColor = texture2D(maskTexture, vUv);

    // Step 1: Check the mask to determine if we should apply the effect
    if (maskColor.r < 0.1 && maskColor.g < 0.1 && maskColor.b < 0.1) {
      // If mask pixel is black, keep the main color
      gl_FragColor = mainColor;
      return;
    }

    // Step 2: If mask is white, proceed to apply the holo effect
    vec4 holoColor = texture2D(holoTexture, vUv);

    // Create an animated refraction effect
    vec2 refractOffset = vec2(sin(time * 3.0 + vUv.y * 15.0) * 0.01, cos(time * 3.0 + vUv.x * 15.0) * 0.01);
    vec4 refractedHolo = texture2D(holoTexture, vUv + refractOffset);

    // Step 3: Calculate brightness of the holo texture
    float holoBrightness = 0.2126 * refractedHolo.r + 0.7152 * refractedHolo.g + 0.0722 * refractedHolo.b;

    vec4 finalColor = mainColor;

    // Use smoothstep for a much wider and smoother blending of the threshold
    float smoothThreshold = smoothstep(holoThreshold - 0.3, holoThreshold + 0.4, holoBrightness);

    if (holoBrightness >= holoThreshold) {
      // Apply the color gradient to the bright areas of the holo texture
      vec4 gradientColor = texture2D(gradientTexture, vUv);

      // Step 4: Apply a softened color dodge effect to enhance the brightness smoothly
      vec3 colorDodge = refractedHolo.rgb / (1.0 - gradientColor.rgb * 0.15 + 0.001);

      // Step 5: Apply a reduced color burn effect for better blending with the base image
      vec3 colorBurn = 1.0 - ((1.0 - mainColor.rgb) / (refractedHolo.rgb + 0.01));

      // Step 6: Dynamically mix the dodge and burn effects
      vec3 shinyEffect = mix(colorDodge, colorBurn, smoothThreshold * 0.4);

      // Step 7: Add slight noise for texture variation
      float noise = (fract(sin(dot(vUv.xy * time, vec2(12.9898,78.233))) * 43758.5453) - 0.5) * 0.05;
      shinyEffect += vec3(noise);

      // Step 8: Blend the shiny effect with the main color with more focus on smoothness
      vec3 blendedColor = mix(mainColor.rgb, shinyEffect, smoothThreshold * 0.6);
      
      // Step 9: Further adjust color balance for natural blending
      blendedColor = mix(blendedColor, gradientColor.rgb, smoothThreshold * 0.25);

      // Assign final color value
      finalColor.rgb = clamp(blendedColor, 0.0, 1.0);
    } else {
      // If the holo pixel is not bright enough, blend the holo effect only slightly
      finalColor.rgb = mix(mainColor.rgb, refractedHolo.rgb, 0.15 * smoothThreshold);
    }

    // Final clamping to avoid artifacts
    finalColor.rgb = clamp(finalColor.rgb, 0.0, 1.0);

    gl_FragColor = vec4(finalColor.rgb, mainColor.a);
  }
`;

const frontShaderMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    mainTexture: { value: null },
    maskTexture: { value: null },
    holoTexture: { value: null },
    gradientTexture: { value: null },
    time: { value: 0.0 },
    holoThreshold: { value: 0.5 },
  },
  side: FrontSide,
});

const backMaterial = new MeshPhysicalMaterial({
  side: BackSide, // Ensure the back face is rendered correctly
});

const sideMaterial = new MeshPhysicalMaterial({
  color: 0xaaaaaa, // A neutral color for the card's sides
  side: DoubleSide,
});

const cardMatCache = new Map<string, CardMaterial>();

export const CARD_DIMENSIONS = {
  width: 59 / 150,
  height: 86 / 150,
  depth: 1 / 150,
};

export type CardMeshOptions = {
  frontTexture: Texture;
  backTexture: Texture;
  name: string;
  transparent?: boolean;
  alphaTest?: number;
  depthWrite?: boolean;
};

const cardGeo = new RoundedBoxGeometry(
  CARD_DIMENSIONS.width,
  CARD_DIMENSIONS.height,
  CARD_DIMENSIONS.depth,
  10,
  4,
);
let mat: ShaderMaterial;
export class CardMesh extends Mesh {
  constructor(options: CardMeshOptions) {
    const { frontTexture, backTexture, name } = options || {};

    const key = name;

    let cardMat: CardMaterial;

    if (cardMatCache.has(key)) {
      cardMat = cardMatCache.get(key)!;
    } else {
      const textureLoader = new TextureLoader();

      const maskTexture = textureLoader.load("/card-masks/cards/54912977.png");
      const warpTexture = textureLoader.load(
        "/card-masks/cards/54912977-foil.png",
      );
      const colorGradientTexture = textureLoader.load("/color-gradient.jpg");

      const frontMaterial = frontShaderMaterial.clone();
      frontMaterial.uniforms.mainTexture.value = frontTexture;
      frontMaterial.uniforms.maskTexture.value = maskTexture;
      frontMaterial.uniforms.holoTexture.value = warpTexture;
      frontMaterial.uniforms.gradientTexture.value = colorGradientTexture;

      mat = frontMaterial;

      const backMat = backMaterial.clone();
      backMat.map = backTexture;

      cardMat = [
        sideMaterial,
        sideMaterial,
        sideMaterial,
        sideMaterial,
        backMat,
        frontMaterial,
      ] as const;

      cardMat.forEach((mat) => {
        mat.polygonOffset = true;
        mat.polygonOffsetFactor = 1;
        mat.polygonOffsetUnits = 1;
      });

      cardMatCache.set(key, cardMat);
    }
    super(cardGeo, cardMat);

    this.receiveShadow = true;
    this.castShadow = true;
    this.name = name;

    const update = () => {
      const t = performance.now();

      const shaderMat = (this.material as any[])[5] as ShaderMaterial;

      shaderMat.uniforms.time.value = t * 0.0001;

      requestAnimationFrame(update);
    };

    update();
  }

  update(time: number) {}
}
