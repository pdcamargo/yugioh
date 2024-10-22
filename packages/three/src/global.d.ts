declare module "n8ao" {
  declare class N8AOPostPass {
    constructor(
      scene: THREE.Scene,
      camera: THREE.Camera,
      width: number,
      height: number,
    );
  }
}

interface GlslifyOption {
  basedir?: string;
  transform?: any;
}
interface Glslify {
  (template: TemplateStringsArray, ...args: any[]): string;
  (file: any, option?: GlslifyOption): string;
  compile(src: string, option?: GlslifyOption): string;
  filename(filename: string, option?: GlslifyOption): string;
}

declare module "glslify" {
  const glsl: Glslify;
  export default glsl;
}
