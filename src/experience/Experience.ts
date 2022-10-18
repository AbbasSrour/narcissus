import { Scene } from "three";
import Renderer from "./Renderer";
import Sizes from "./utils/Sizes";
import Time from "./utils/Time";

export default class Experience {
  private static instance: Experience;

  public canvas: HTMLCanvasElement;
  public sizes: Sizes;
  public time: Time;
  public scene: Scene;
  public renderer: Renderer;

  constructor(canvas: HTMLCanvasElement) {
    if (Experience.instance) return Experience.Instance;
    Experience.instance = this;

    this.canvas = canvas;
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new Scene();
    this.renderer = new Renderer()
  }

  public static get Instance() {
    if (Experience.instance) return Experience.instance;
    else throw Error;
  }
}
