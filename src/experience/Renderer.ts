import { WebGLRenderer } from "three";
import Experience from "./Experience";

export default class Renderer {
  private experience: Experience;
  private renderer: WebGLRenderer;

  constructor() {
    this.experience = Experience.Instance;
    this.renderer = this.setRenderer();
  }

  private setRenderer(): WebGLRenderer {
    const clearColor = '#010101'
    const renderer = new WebGLRenderer({
      alpha: false,
      antialias: true
    })
    renderer.setClearColor(clearColor, 1);
    renderer.setSize(this)
    return renderer;
  }
}
