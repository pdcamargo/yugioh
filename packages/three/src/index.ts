import {
  BoxGeometry,
  Mesh,
  MeshPhysicalMaterial,
  Texture,
  Material,
  TextureLoader,
  RepeatWrapping,
  Color,
  Vector2,
  Vector3,
  Vector4,
} from "three";
export * from "postprocessing";

export * from "three";
export * from "n8ao";

export {
  OrbitControls,
  type OrbitControlsEventMap,
} from "three/examples/jsm/controls/OrbitControls.js";
export {
  GLTFLoader,
  type GLTF,
} from "three/examples/jsm/loaders/GLTFLoader.js";
export { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
export {
  FontLoader,
  Font,
  type FontData,
} from "three/examples/jsm/loaders/FontLoader.js";
export { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
export { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export { BufferGeometryUtils } from "three/examples/jsm/Addons.js";

export { TextGeometry } from "three/addons/geometries/TextGeometry.js";

// export fps counter from "three/examples/jsm/libs/stats.module.js";
export { default as Stats } from "three/examples/jsm/libs/stats.module.js";

//export graphical UI lib from "three/examples/jsm/libs/dat.gui.module.js";
export * from "three/examples/jsm/libs/lil-gui.module.min.js";

export * from "./meshes";

export * from "./glslfy";

export const randomInt = (min: number, max: number, inclusive = true) => {
  // if incluse is true, the random min and max can be the actual min and max, otherwise it will be between them
  if (inclusive) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return Math.floor(Math.random() * (max - min)) + min;
};

export const randomFloat = (min: number, max: number, inclusive = true) => {
  // if incluse is true, the random min and max can be the actual min and max, otherwise it will be between them
  if (inclusive) {
    return Math.random() * (max - min) + min;
  }

  return Math.random() * (max - min) + min;
};

export const randomBool = () => Math.random() < 0.5;

export const randomColor = () => {
  const r = Math.random() * 0xffffff;

  return new Color(r);
};

export const randomVector2 = (min: number, max: number, inclusive = true) => {
  return new Vector2(
    randomFloat(min, max, inclusive),
    randomFloat(min, max, inclusive),
  );
};

export const randomIntVector2 = (
  min: number,
  max: number,
  inclusive = true,
) => {
  return new Vector2(
    randomInt(min, max, inclusive),
    randomInt(min, max, inclusive),
  );
};

export const random01Vector2 = () => {
  return new Vector2(Math.random(), Math.random());
};

export const randomVector3 = (min: number, max: number, inclusive = true) => {
  return new Vector3(
    randomFloat(min, max, inclusive),
    randomFloat(min, max, inclusive),
    randomFloat(min, max, inclusive),
  );
};

export const randomIntVector3 = (
  min: number,
  max: number,
  inclusive = true,
) => {
  return new Vector3(
    randomInt(min, max, inclusive),
    randomInt(min, max, inclusive),
    randomInt(min, max, inclusive),
  );
};

export const random01Vector3 = () => {
  return new Vector3(Math.random(), Math.random(), Math.random());
};

export const random01Vector4 = () => {
  return new Vector4(
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
  );
};
