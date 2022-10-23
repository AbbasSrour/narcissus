import {Scene} from "three";
import Renderer from "./Renderer";
import Config from "./types/Config";
import {Options} from "./types/options";
import {Pane} from 'tweakpane'
import Sizes from "./utils/Sizes";
import Time from "./utils/Time";
import Stats from './utils/Stats'
import Camera from "./Camera";
import Resources from "./Resources";
import assets from "./assets";
import Navigation from "./Navigation";
import World from "./World";

export default class Experience {
  private static instance: Experience;

  public canvas: HTMLCanvasElement;
  public time: Time;
  public sizes: Sizes;
  public config: Config;
  public stats: Stats | undefined;
  public scene: Scene;
  public camera: Camera;
  public renderer: Renderer;
  public debug: Pane | undefined;
  public resources: Resources;
  public navigation: Navigation;
  public world: World;

  constructor(options: Options) {
    Experience.instance = this;
    this.canvas = options.targetedElement;
    this.time = new Time()
    this.sizes = new Sizes()
    this.config = this.createConfig()
    this.stats = this.setStats();
    this.setDebug()
    this.scene = new Scene();
    this.camera = new Camera();
    this.renderer = new Renderer()
    this.resources = new Resources(assets)
    this.navigation = new Navigation()
    this.world = new World()

    this.sizes.on('resize', () => {
      this.resize()
    })

    this.update()
  }

  public static get Instance() {
    if (Experience.instance) return Experience.instance;
    else throw Error;
  }

  public static create(options: Options) {
    if (Experience.instance) return Experience.Instance
    else new Experience(options);
  }

  public destroy() {
    throw new Error("Method not implemented.");
  }

  public resize() {
    const boundings = this.canvas.getBoundingClientRect()
    this.config.width = boundings.width
    this.config.height = boundings.height
    this.config.smallestSide = Math.min(this.config.width, this.config.height)
    this.config.largestSide = Math.max(this.config.width, this.config.height)
    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

    if (this.camera) this.camera.resize()
    if (this.renderer) this.renderer.resize()
    if (this.world) this.world.resize()
  }

  public update() {
    if (this.stats) this.stats.update()
    this.camera.update()
    if (this.renderer) this.renderer.update()
    if (this.world) this.world.update()
    if (this.navigation) this.navigation.update()
    window.requestAnimationFrame(() => {
      this.update()
    })
  }

  private createConfig(): Config {
    const pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)
    const boundings = this.canvas.getBoundingClientRect()
    const width = boundings.width
    const height = boundings.height || window.innerHeight
    const smallestSide = Math.min(width, height)
    const largestSide = Math.max(width, height)
    const debug = width > 420
    return {
      width,
      height,
      pixelRatio,
      smallestSide,
      largestSide,
      debug
    }
  }

  private setStats() {
    if (this.config.debug) return new Stats(true)
    else null;
  }

  private setDebug() {
    if (this.config.debug) {
      this.debug = new Pane()
      this.debug.element.style.width = '320px'
    }
  }
}
