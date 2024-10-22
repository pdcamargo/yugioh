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

declare module "*.glsl" {
  const value: string;
  export default value;
}

declare module "*.vert" {
  const value: string;
  export default value;
}

declare module "*.frag" {
  const value: string;
  export default value;
}

declare type CardJsonInfo = {
  id: string;
  name: string;
  type: string;
  humanReadableCardType: string;
  frameType: string;
  desc: string;
  race: string;
  archetype?: string;
  card_sets?: Array<{
    set_name: string;
    set_code: string;
    set_rarity: string;
    set_rarity_code: string;
    set_price: string;
  }>;
  card_images: Array<{
    id: number;
    image_url: string;
    image_url_cropped: string;
  }>;
  typeline?: Array<string>;
  atk?: number;
  def?: number;
  level?: number;
  attribute?: string;
  pend_desc?: string;
  monster_desc?: string;
  scale?: number;
  linkval?: number;
  linkmarkers?: Array<string>;
  banlist_info?: {
    ban_tcg?: string;
    ban_ocg?: string;
    ban_goat?: string;
  };
};

declare module "next-auth" {
  interface Session extends DefaultSession {
    id: string;
  }
}