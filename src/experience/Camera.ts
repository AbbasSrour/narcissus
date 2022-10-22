import * as three from 'three';
import Experience from './Experience';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Config from './types/Config';
import { PerspectiveCamera } from 'three';

enum Mode {
  default = "default",
  debug = "debug"
}


export default class Camera {
  public instance: PerspectiveCamera;
  private experience: Experience;
  private mode: Mode;
  private modes: {
    default: { [key: string]: any }
    debug: { [key: string]: any }
  }
  private scene: three.Scene;
  private config: Config;
  private canvas: HTMLCanvasElement;

  constructor(options?: any) {
    this.experience = Experience.Instance;
    this.canvas = this.experience.canvas;
    this.scene = this.experience.scene;
    this.config = this.experience.config;
    this.mode = Mode.default;
    this.modes = { default: {}, debug: {} }
    this.instance = this.createPerspectiveCamera();
    this.setModes()
  }

  createPerspectiveCamera() {
    const perspectiveCamera = new three.PerspectiveCamera(20, this.config.width / this.config.height, 0.1, 150)
    perspectiveCamera.rotation.reorder('YXZ')
    this.scene.add(perspectiveCamera)
    return perspectiveCamera;
  }

  setModes() {
    // Default
    this.modes.default = {};
    this.modes.default.instance = this.instance.clone();
    this.modes.default.instance.rotation.reorder('YXZ');

    // Debug
    this.modes.debug = {};
    this.modes.debug.instance = this.instance.clone();
    this.modes.debug.instance.rotation.reorder('YXZ');
    this.modes.debug.instance.position.set(- 15, 15, 15);

    this.modes.debug.orbitControls = new OrbitControls(this.modes.debug.instance, this.canvas)
    this.modes.debug.orbitControls.enabled = false
    this.modes.debug.orbitControls.screenSpacePanning = true
    this.modes.debug.orbitControls.enableKeys = false
    this.modes.debug.orbitControls.zoomSpeed = 0.25
    this.modes.debug.orbitControls.enableDamping = true
    this.modes.debug.orbitControls.update()
  }


  resize() {
    this.instance.aspect = this.config.width / this.config.height
    this.instance.updateProjectionMatrix()

    this.modes.default.instance.aspect = this.config.width / this.config.height
    this.modes.default.instance.updateProjectionMatrix()

    this.modes.debug.instance.aspect = this.config.width / this.config.height
    this.modes.debug.instance.updateProjectionMatrix()
  }

  update() {
    // Update debug orbit controls
    this.modes.debug.orbitControls.update()

    // Apply coordinates
    this.instance.position.copy(this.modes[this.mode].instance.position)
    this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion)
    this.instance.updateMatrixWorld() // To be used in projection
  }

  destroy() {
    this.modes.debug.orbitControls.destroy()
  }
}
