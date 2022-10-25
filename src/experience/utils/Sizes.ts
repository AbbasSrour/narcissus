import {EventEmitter} from "events";

export default class Sizes extends EventEmitter {
  private width: number;
  private height: number;
  private aspect: number;
  private pixelRatio: number;
  private frustrum: number;

  constructor() {
    super();
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.aspect = this.width / this.height
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    this.frustrum = 5

    window.addEventListener('resize', () => this.resize())
  }

  private resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    this.emit("resize")
  }
}
