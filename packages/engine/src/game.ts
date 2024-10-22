import * as THREE from "@repo/three";
import EventEmitter from "eventemitter3";

export interface EntityBaseEvents {
  mouseEnter: () => void;
  mouseLeave: () => void;
  mouseDown: () => void;
  mouseUp: () => void;
  mouseMove: () => void;
  destroy: () => void;
}

export class EntityEvent {
  isDefaultPrevented = false;

  constructor(public originalEvent: MouseEvent) {}

  preventDefault() {
    this.isDefaultPrevented = true;
  }
}

class Entity<T extends EventEmitter.ValidEventTypes> extends EventEmitter<T> {
  constructor(
    public name: string,
    protected readonly game: Game,
  ) {
    super();
  }

  startup() {}

  update(dt: number) {}
  preUpdate(dt: number) {}
  lateUpdate(dt: number) {}
  fixedUpdate(dt: number) {}

  onBeforeRender() {}
  onRender() {}
  onPostRender() {}

  onMouseEnter(e: EntityEvent) {}
  onMouseLeave(e: EntityEvent) {}
  onMouseDown(e: EntityEvent) {}
  onMouseUp(e: EntityEvent) {}
  onMouseMove(e: EntityEvent) {}
}

export class Component<
  T extends EntityBaseEvents = EntityBaseEvents,
> extends Entity<T> {
  constructor(
    public name: string,
    protected readonly game: Game,
    public gameObject: GameObject,
  ) {
    super(name, game);
  }
}

type ComponentConstructor<T extends Component<any>> = new (
  name: string,
  game: Game,
  gameObject: GameObject,
) => T;

export class GameObject<
  T extends THREE.Object3D = THREE.Object3D,
  E extends Record<string, any> = Record<string, any>,
> extends Entity<E & EntityBaseEvents> {
  public readonly components: Component<any>[] = [];
  public readonly children: GameObject[] = [];
  public parent: GameObject | null = null;

  public readonly transform: T;

  constructor(
    public name: string,
    protected readonly game: Game,
    transform?: T,
    parent?: GameObject,
    options?: {
      isMouseInteractable?: boolean;
    },
  ) {
    super(name, game);

    this.transform = (transform || new THREE.Object3D()) as T;

    if (parent) {
      parent.addChild(this);
    }

    this.transform.userData = {
      gameObject: this,
    };

    if (options?.isMouseInteractable === true) {
      this.game.mouseInteractableGameObjects.push(this);
    }
  }

  isMouseInteractable() {
    return this.game.mouseInteractableGameObjects.includes(this);
  }

  setIsMouseInteractable(value: boolean) {
    if (value && !this.isMouseInteractable()) {
      this.game.mouseInteractableGameObjects.push(this);
    } else if (!value && this.isMouseInteractable()) {
      const index = this.game.mouseInteractableGameObjects.indexOf(this);

      if (index !== -1) {
        this.game.mouseInteractableGameObjects.splice(index, 1);
      }
    }
  }

  setParent(parent: GameObject) {
    if (this.parent) {
      this.parent.removeChild(this);
    }

    parent.addChild(this);
  }

  addChild(...gameObjects: GameObject<any, any>[]) {
    gameObjects.forEach((gameObject) => {
      this.children.push(gameObject);
      this.transform.add(gameObject.transform);

      if (gameObject.parent) {
        gameObject.parent.removeChild(gameObject);
      }

      gameObject.parent = this;
    });
  }

  removeChild(gameObject: GameObject<any, any>) {
    const index = this.children.indexOf(gameObject);

    if (index !== -1) {
      this.children.splice(index, 1);
      this.transform.remove(gameObject.transform);
      gameObject.parent = null;
    }
  }

  addComponent<T extends Component>(target: ComponentConstructor<T>): T {
    const component = new target(this.name, this.game, this as any);

    this.components.push(component);

    return component as T;
  }

  getComponent<T extends Component>(type: ComponentConstructor<T>) {
    const component = this.components.find((c) => c instanceof type);

    if (!component) {
      throw new Error(`Component not found: ${type.name}`);
    }

    return component as T;
  }

  tryGetComponent<T extends Component>(type: ComponentConstructor<T>) {
    try {
      return this.getComponent<T>(type);
    } catch {
      return null;
    }
  }

  removeComponent<T extends Component>(type: ComponentConstructor<T>) {
    const index = this.components.findIndex((c) => c instanceof type);

    if (index !== -1) {
      this.components.splice(index, 1);
    }
  }

  startup(): void {
    for (const component of this.components) {
      component.startup();
    }

    for (const child of this.children) {
      child.startup();
    }
  }

  update(dt: number): void {
    for (const component of this.components) {
      component.update(dt);
    }

    for (const child of this.children) {
      child.update(dt);
    }
  }

  preUpdate(dt: number): void {
    for (const component of this.components) {
      component.preUpdate(dt);
    }

    for (const child of this.children) {
      child.preUpdate(dt);
    }
  }

  lateUpdate(dt: number): void {
    for (const component of this.components) {
      component.lateUpdate(dt);
    }

    for (const child of this.children) {
      child.lateUpdate(dt);
    }
  }

  fixedUpdate(dt: number): void {
    for (const component of this.components) {
      component.fixedUpdate(dt);
    }

    for (const child of this.children) {
      child.fixedUpdate(dt);
    }
  }

  destroy(): void {
    // this.onDestroy();

    for (const child of this.children) {
      child.destroy();
    }

    if (this.parent) {
      this.parent.removeChild(this);
    }
  }
}

export class Schedule {
  private systems = {
    startup: [] as Function[],
    preUpdate: [] as Function[],
    update: [] as Function[],
    lateUpdate: [] as Function[],
    fixedUpdate: [] as Function[],
    preRender: [] as Function[],
    render: [] as Function[],
    postRender: [] as Function[],
    shutdown: [] as Function[],
    frameStart: [] as Function[],
    frameEnd: [] as Function[],
  };

  #deltaTime = 0;
  #lastTime = 0;
  #accumulator = 0;
  #fixedTimeStep = 1 / 60; // 60 FPS
  #animationFrameId: number | null = null;
  #elapsedTime = 0;

  public get fixedDeltaTime() {
    return this.#fixedTimeStep;
  }

  public get deltaTime() {
    return this.#deltaTime;
  }

  public get elapsedTime() {
    return this.#elapsedTime;
  }

  addSystem(type: keyof Schedule["systems"], system: Function) {
    this.systems[type].push(system);
  }

  start() {
    this.executeSystems("startup");
    this.#lastTime = performance.now();
    this.loop();
  }

  private loop = () => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.#lastTime) / 1000;
    this.#deltaTime = deltaTime;
    this.#accumulator += deltaTime;
    this.#lastTime = currentTime;
    this.#elapsedTime += deltaTime;

    this.executeSystems("frameStart");

    // Execute preUpdate systems
    this.executeSystems("preUpdate");

    // Execute fixedUpdate systems, ensuring a fixed time step to prevent jittering
    while (this.#accumulator >= this.#fixedTimeStep) {
      this.executeSystems("fixedUpdate");
      this.#accumulator -= this.#fixedTimeStep;
    }

    // Execute update systems
    this.executeSystems("update");

    // Execute lateUpdate systems
    this.executeSystems("lateUpdate");

    // Execute preRender systems
    this.executeSystems("preRender");

    // Execute render systems
    this.executeSystems("render");

    // Execute postRender systems
    this.executeSystems("postRender");

    this.executeSystems("frameEnd");

    // Continue the loop
    this.#animationFrameId = requestAnimationFrame(this.loop);
  };

  private executeSystems(type: keyof Schedule["systems"]) {
    for (const system of this.systems[type]) {
      system(type === "fixedUpdate" ? this.#fixedTimeStep : this.#deltaTime);
    }
  }

  shutdown() {
    if (this.#animationFrameId !== null) {
      cancelAnimationFrame(this.#animationFrameId);

      this.#animationFrameId = null;
    }

    this.executeSystems("shutdown");
  }
}

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

export type GameEvents = {
  "debug-mode": (debug: boolean) => void;
};

export class Game extends EventEmitter<GameEvents> {
  public readonly scene: THREE.Scene = new THREE.Scene();
  public readonly editorCamera: THREE.PerspectiveCamera;
  public readonly gameCamera: THREE.PerspectiveCamera;
  public readonly renderer: THREE.WebGLRenderer;
  public readonly effectComposer: THREE.EffectComposer;
  public readonly orbitControls: THREE.OrbitControls;

  private _intersected: GameObject | null = null;
  previousIntersections: THREE.Intersection[] = [];

  public currentCameraType: "editor" | "game" = "editor";

  public mouseInteractableGameObjects: GameObject<any, any>[] = [];

  public readonly gui: THREE.GUI;

  private _fps: THREE.Stats;

  private _textureCache = new Map<string, THREE.Texture>();
  private _gltfCache = new Map<string, THREE.GLTF>();
  private _hdrCache = new Map<string, THREE.DataTexture>();
  private _fontCache = new Map<string, THREE.Font>();

  private loader = new THREE.LoadingManager();

  public readonly textureLoader = new THREE.TextureLoader(this.loader);
  public readonly gltfLoader = new THREE.GLTFLoader(this.loader);
  public readonly rgbLoader = new THREE.RGBELoader(this.loader);
  public readonly fontLoader = new THREE.FontLoader(this.loader);

  public readonly root = new GameObject("Root", this);

  private _schedule = new Schedule();

  private _debug = false;

  private _lastMouseMoveEntityEvent: EntityEvent | null = null;

  constructor() {
    super();

    (window as any).setDebugMode = (value: boolean) => {
      this.debug = value;
    };

    this.root.transform.name = "Root";

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      precision: "highp",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setClearColor(0xfefefe);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer = renderer;

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    const gameCamera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    camera.position.set(0, 6, -1);
    camera.rotation.set(1.45, 0, 0);

    /**
     * Position: 1.21, 4.41, 0.71
game.ts:554 Rotation: -1.19, 0.00, 0.01
     */

    gameCamera.position.set(1.21, 4.41, 0.2);
    gameCamera.rotation.set(-1.3, 0, 0.01);

    this.editorCamera = camera;
    this.gameCamera = gameCamera;

    this.scene.add(this.root.transform);

    this.effectComposer = new THREE.EffectComposer(renderer);

    const renderPass = new THREE.RenderPass(this.scene, this.gameCamera);

    this.effectComposer.addPass(renderPass);

    // @ts-expect-error -- N8AOPostPass does not have types
    const n8aoPass = new THREE.N8AOPostPass(
      this.scene,
      gameCamera,
      this.renderer.domElement.clientWidth,
      this.renderer.domElement.clientHeight,
    );

    this.effectComposer.addPass(n8aoPass);

    n8aoPass.configuration.aoRadius = 0.05;
    n8aoPass.configuration.distanceFalloff = 1;
    n8aoPass.configuration.accumulate = true;
    n8aoPass.configuration.intensity = 20;

    const effectPass = new THREE.EffectPass(
      this.gameCamera,
      new THREE.SMAAEffect({
        preset: THREE.SMAAPreset.ULTRA,
      }),
    );

    this.effectComposer.addPass(effectPass);

    this.orbitControls = new THREE.OrbitControls(
      this.editorCamera,
      this.renderer.domElement,
    );

    document.getElementById("game")?.appendChild(this.renderer.domElement);

    this.setupEventListeners();

    this.gui = new THREE.GUI({
      title: "Game",
      width: 300,
    });

    this.gui.hide();

    this.gui
      .add(this, "currentCameraType", ["editor", "game"])
      .onChange(() => {
        if (this.currentCameraType === "editor") {
          this.orbitControls.enabled = true;
        } else {
          this.orbitControls.enabled = false;
        }
      })
      .name("Camera Type");

    const n8aoGui = this.gui.addFolder("N8AO");
    n8aoGui.close();

    n8aoGui
      .add(n8aoPass.configuration, "aoRadius")
      .min(0)
      .max(10)
      .step(0.01)
      .name("AO Radius");

    n8aoGui
      .add(n8aoPass.configuration, "distanceFalloff")
      .min(0)
      .max(100)
      .step(0.1)
      .name("Distance Falloff");

    n8aoGui.add(n8aoPass.configuration, "accumulate").name("Accumulate");

    n8aoGui
      .add(n8aoPass.configuration, "intensity")
      .min(0)
      .max(100)
      .step(0.1)
      .name("Intensity");

    this.emit("debug-mode", this._debug);

    this._fps = new THREE.Stats();

    this._fps.showPanel(0);

    const fpsContainer = document.createElement("div");

    fpsContainer.appendChild(this._fps.dom);

    fpsContainer.style.pointerEvents = "none";

    document.body.appendChild(fpsContainer);

    if (this.debug) {
      fpsContainer.style.display = "block";
    } else {
      fpsContainer.style.display = "none";
    }

    const cameraGui = this.gui.addFolder("Camera");

    cameraGui.close();

    const cameraPosGui = cameraGui.addFolder("Position");

    cameraPosGui
      .add(gameCamera.position, "x", -10, 10, 0.1)
      .name("X")
      .onChange(() => {
        gameCamera.updateProjectionMatrix();
      });
    cameraPosGui
      .add(gameCamera.position, "y", -10, 10, 0.1)
      .step(0.1)
      .name("Y")
      .onChange(() => {
        gameCamera.updateProjectionMatrix();
      });
    cameraPosGui
      .add(gameCamera.position, "z", -10, 10, 0.1)
      .step(0.1)
      .name("Z")
      .onChange(() => {
        gameCamera.updateProjectionMatrix();
      });

    const cameraRotGui = cameraGui.addFolder("Rotation");

    cameraRotGui
      .add(gameCamera.rotation, "x", -10, 10, 0.1)
      .name("X")
      .onChange(() => {
        gameCamera.updateProjectionMatrix();
      });
    cameraRotGui
      .add(gameCamera.rotation, "y", -10, 10, 0.1)
      .name("Y")
      .onChange(() => {
        gameCamera.updateProjectionMatrix();
      });
    cameraRotGui
      .add(gameCamera.rotation, "z", -10, 10, 0.1)
      .name("Z")
      .onChange(() => {
        gameCamera.updateProjectionMatrix();
      });

    cameraGui
      .add(gameCamera, "fov")
      .min(1)
      .max(180)
      .name("FOV")
      .onChange(() => {
        gameCamera.updateProjectionMatrix();
      });

    window.logEditorCamera = () => {
      // log the normalize values so it can be used to set the game camera as the default values for pos and rot
      console.log(
        `Position: ${this.editorCamera.position.x.toFixed(2)}, ${this.editorCamera.position.y.toFixed(2)}, ${this.editorCamera.position.z.toFixed(2)}`,
      );
      console.log(
        `Rotation: ${this.editorCamera.rotation.x.toFixed(2)}, ${this.editorCamera.rotation.y.toFixed(2)}, ${this.editorCamera.rotation.z.toFixed(2)}`,
      );
    };
  }

  public get currentCamera() {
    return this.currentCameraType === "editor"
      ? this.editorCamera
      : this.gameCamera;
  }

  public get deltaTime() {
    return this._schedule.deltaTime;
  }

  public get elapsedTime() {
    return this._schedule.elapsedTime;
  }

  public get fixedDeltaTime() {
    return this._schedule.fixedDeltaTime;
  }

  public get debug() {
    return this._debug;
  }

  public set debug(value: boolean) {
    this._debug = value;

    if (value) {
      this.gui.show();
      this._fps.dom.parentElement!.style.display = "block";
    } else {
      this.gui.hide();
      this._fps.dom.parentElement!.style.display = "none";
    }

    this.emit("debug-mode", value);
  }

  updateMousePosition(mouse: THREE.Vector2, event: MouseEvent) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  getIntersects(
    mouse: THREE.Vector2,
    gameObjects: GameObject[],
  ): THREE.Intersection[] {
    raycaster.setFromCamera(mouse, this.gameCamera);
    return raycaster.intersectObjects(
      gameObjects.map((go) => go.transform),
      true,
    );
  }

  processIntersections(
    intersects: THREE.Intersection[],
    entityEvent: EntityEvent,
    eventType: keyof EntityBaseEvents,
  ) {
    for (let intersect of intersects) {
      const gameObject = intersect.object.userData.gameObject as GameObject;

      if (!gameObject) continue;

      gameObject.emit(eventType);
      // @ts-expect-error -- @TODO fix this in the future
      gameObject["on" + this.capitalize(eventType)](entityEvent);

      // If preventDefault() is called, stop further event propagation
      if (entityEvent.isDefaultPrevented) {
        break;
      }
    }
  }

  processMouseEnterLeave(
    intersects: THREE.Intersection[],
    entityEvent: EntityEvent,
  ) {
    if (intersects.length > 0) {
      const gameObject = intersects[0].object.userData.gameObject as GameObject;

      if (this._intersected !== gameObject) {
        if (this._intersected) {
          this._intersected.emit("mouseLeave");
          this._intersected.onMouseLeave(entityEvent);
          if (entityEvent.isDefaultPrevented) return;
        }

        this._intersected = gameObject;
        gameObject.emit("mouseEnter");
        gameObject.onMouseEnter(entityEvent);
      }
    } else {
      if (this._intersected) {
        this._intersected.emit("mouseLeave");
        this._intersected.onMouseLeave(entityEvent);
        this._intersected = null;
      }
    }
  }

  capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  handleMouseEnterLeave(
    intersects: THREE.Intersection[],
    entityEvent: EntityEvent,
  ) {
    const currentObjects = intersects
      .map((intersect) => intersect.object.userData.gameObject)
      .filter(Boolean);
    const previousObjects = this.previousIntersections
      .map((intersect) => intersect.object.userData.gameObject)
      .filter(Boolean);

    // Handle mouseEnter for objects newly intersected
    for (const intersect of intersects) {
      const gameObject = intersect.object.userData.gameObject as GameObject;

      if (!previousObjects.includes(gameObject) && gameObject) {
        gameObject.emit("mouseEnter");
        gameObject.onMouseEnter(entityEvent);
        if (entityEvent.isDefaultPrevented) break; // Stop if preventDefault was called
      }
    }

    // Handle mouseLeave for objects no longer intersected
    for (const intersect of this.previousIntersections) {
      const gameObject = intersect.object.userData.gameObject as GameObject;

      if (!currentObjects.includes(gameObject) && gameObject) {
        gameObject.emit("mouseLeave");
        gameObject.onMouseLeave(entityEvent);
        if (entityEvent.isDefaultPrevented) break; // Stop if preventDefault was called
      }
    }

    this.previousIntersections = intersects.slice(); // Update previous intersections
  }

  handleMouseMove(intersects: THREE.Intersection[], entityEvent: EntityEvent) {
    for (const intersect of intersects) {
      const gameObject = intersect.object.userData.gameObject as GameObject;

      if (!gameObject) continue;

      gameObject.emit("mouseMove");
      gameObject.onMouseMove(entityEvent);

      // Stop propagation if preventDefault() was called
      if (entityEvent.isDefaultPrevented) break;
    }
  }

  setupEventListeners() {
    this.renderer.domElement.addEventListener("mousemove", (event) => {
      const entityEvent = new EntityEvent(event);
      this.updateMousePosition(mouse, event);

      this._lastMouseMoveEntityEvent = entityEvent;
    });

    this.renderer.domElement.addEventListener("mousedown", (event) => {
      const entityEvent = new EntityEvent(event);
      this.updateMousePosition(mouse, event);

      const intersects = this.getIntersects(
        mouse,
        this.mouseInteractableGameObjects,
      );
      this.processIntersections(intersects, entityEvent, "mouseDown"); // Handle all objects
    });

    this.renderer.domElement.addEventListener("mouseup", (event) => {
      const entityEvent = new EntityEvent(event);
      this.updateMousePosition(mouse, event);

      const intersects = this.getIntersects(
        mouse,
        this.mouseInteractableGameObjects,
      );
      this.processIntersections(intersects, entityEvent, "mouseUp"); // Handle all objects
    });
  }

  public async loadTexture(url: string) {
    if (this._textureCache.has(url)) {
      return Promise.resolve(this._textureCache.get(url)!);
    }

    const texture = await this.textureLoader.loadAsync(url);

    texture.anisotropy = this.maxAnisotropy;

    this._textureCache.set(url, texture);

    return texture;
  }

  public async loadFont(url: string) {
    if (this._fontCache.has(url)) {
      return Promise.resolve(this._fontCache.get(url)!);
    }

    const font = await this.fontLoader.loadAsync(url);

    this._fontCache.set(url, font);

    return font;
  }

  public async loadGLTF(url: string) {
    if (this._gltfCache.has(url)) {
      return Promise.resolve(this._gltfCache.get(url)!);
    }

    const gltf = await this.gltfLoader.loadAsync(url);

    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          if (Array.isArray(child.material)) {
            for (const material of child.material) {
              if (material.map) {
                material.map.anisotropy = this.maxAnisotropy;
              }
            }
          } else {
            if (child.material.map) {
              child.material.map.anisotropy = this.maxAnisotropy;
            }
          }
        }
      }
    });

    this._gltfCache.set(url, gltf);

    return gltf;
  }

  public async loadHDR(url: string) {
    if (this._hdrCache.has(url)) {
      return Promise.resolve(this._hdrCache.get(url)!);
    }

    const hdr = await this.rgbLoader.loadAsync(url);

    this._hdrCache.set(url, hdr);
  }

  public getTexture(url: string) {
    return this._textureCache.get(url);
  }

  public getGLTF(url: string) {
    return this._gltfCache.get(url);
  }

  public getHDR(url: string) {
    return this._hdrCache.get(url);
  }

  public getFont(url: string) {
    return this._fontCache.get(url);
  }

  async init(options?: {
    preload?: {
      textures?: string[];
      gltfs?: string[];
      hdrs?: string[];
      fonts?: string[];
    };
  }) {
    if (options?.preload) {
      let preloads: Promise<any>[] = [];

      if (options.preload.textures) {
        preloads = preloads.concat(
          options.preload.textures.map((url) => this.loadTexture(url)),
        );
      }

      if (options.preload.gltfs) {
        preloads = preloads.concat(
          options.preload.gltfs.map((url) => this.loadGLTF(url)),
        );
      }

      if (options.preload.hdrs) {
        preloads = preloads.concat(
          options.preload.hdrs.map((url) => this.loadHDR(url)),
        );
      }

      if (options.preload.fonts) {
        preloads = preloads.concat(
          options.preload.fonts.map((url) => this.loadFont(url)),
        );
      }

      await Promise.all(preloads);
    }

    this._schedule.addSystem("frameStart", () => {
      this._fps.begin();

      if (this._lastMouseMoveEntityEvent) {
        const intersects = this.getIntersects(
          mouse,
          this.mouseInteractableGameObjects,
        );
        this.handleMouseEnterLeave(intersects, this._lastMouseMoveEntityEvent);
        this.handleMouseMove(intersects, this._lastMouseMoveEntityEvent);

        this._lastMouseMoveEntityEvent = null;
      }
    });

    this._schedule.addSystem("frameEnd", () => {
      this._fps.end();
    });

    this._schedule.addSystem("startup", () => {
      this.root.startup();
    });

    this._schedule.addSystem("preUpdate", () => {
      this.root.preUpdate(this._schedule.deltaTime);
    });

    this._schedule.addSystem("update", () => {
      this.orbitControls.update();

      this.root.update(this._schedule.deltaTime);
    });

    this._schedule.addSystem("lateUpdate", () => {
      this.root.lateUpdate(this._schedule.deltaTime);
    });

    this._schedule.addSystem("fixedUpdate", () => {
      this.root.fixedUpdate(this._schedule.fixedDeltaTime);
    });

    this._schedule.addSystem("preRender", () => {
      this.root.onBeforeRender();
    });

    this._schedule.addSystem("render", () => {
      if (this.currentCameraType === "game") {
        this.effectComposer.render();
      } else {
        this.renderer.render(this.scene, this.editorCamera);
      }

      this.root.onRender();
    });

    this._schedule.addSystem("postRender", () => {
      this.root.onPostRender();
    });

    this._schedule.addSystem("shutdown", () => {
      this.root.destroy();
    });
  }

  start() {
    this._schedule.start();
  }

  addSystem(type: keyof Schedule["systems"], system: Function) {
    this._schedule.addSystem(type, system);
  }

  shutdown() {
    this._schedule.shutdown();
  }

  addGameObject(...gameObjects: GameObject[]) {
    for (const gameObject of gameObjects) {
      this.root.addChild(gameObject);
    }
  }

  createGameObject<T extends THREE.Object3D>(
    name: string,
    transform?: T,
    parent?: GameObject,
  ) {
    const go = new GameObject(name, this, transform, parent);

    if (!parent) {
      this.root.addChild(go);
    }

    return go;
  }

  public get maxAnisotropy() {
    return this.renderer.capabilities.getMaxAnisotropy();
  }
}
