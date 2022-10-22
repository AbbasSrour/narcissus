import { LinearFilter, RGBFormat, Scene, sRGBEncoding, WebGLMultisampleRenderTarget, WebGLRenderer, WebGLRenderTarget } from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import Camera from "./Camera";
import Experience from "./Experience";
import Config from "./types/Config";
import Stats from "./utils/Stats";

export default class Renderer {
  public renderer: WebGLRenderer;
  private experience: Experience;
  private config: Config;
  private camera: Camera;
  private scene: Scene;
  private renderTarget: WebGLRenderTarget | undefined;
  private postProcess: {
    renderPass: RenderPass;
    composer: EffectComposer;
  } | undefined;
  private stats: Stats | undefined
  private usePostprocess: boolean;
  private canvas: HTMLCanvasElement;

  constructor(options?: any) {
    this.experience = Experience.Instance;
    this.config = this.experience.config;
    this.camera = this.experience.camera
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas
    this.renderer = this.setRenderer();
    this.stats = this.experience.stats
    this.usePostprocess = false
  }

  public resize() {
    // renderer
    this.renderer.setSize(this.config.width, this.config.height)
    this.renderer.setPixelRatio(this.config.pixelRatio)

    // Post process
    this.postProcess?.composer.setSize(this.config.width, this.config.height)
    this.postProcess?.composer.setPixelRatio(this.config.pixelRatio)
  }

  public update() {
    if (this.stats) {
      this.stats.beforeRender()
    }

    if (this.usePostprocess && this.postProcess) this.postProcess.composer.render()
    else this.renderer.render(this.scene, this.camera.instance)


    if (this.stats) this.stats.afterRender()
  }

  public destroy() {
    this.renderer.renderLists.dispose()
    this.renderer.dispose()
    this.renderTarget?.dispose()
    this.postProcess?.composer.renderTarget1.dispose()
    this.postProcess?.composer.renderTarget2.dispose()
  }

  private setRenderer(): WebGLRenderer {
    const clearColor = '#010101'
    const renderer = new WebGLRenderer({
      alpha: false,
      antialias: true,
      canvas: this.canvas
    })
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = "0"
    renderer.domElement.style.left = "0"
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'

    // renderer.setClearColor(clearColor, 1);
    renderer.setSize(this.config.width, this.config.height)
    renderer.setPixelRatio(this.config.pixelRatio)

    // renderer.physicallyCorrectLights = true
    // renderer.gammaOutPut = true
    renderer.outputEncoding = sRGBEncoding
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // renderer.shadowMap.enabled = false
    // renderer.toneMapping = THREE.ReinhardToneMapping
    // renderer.toneMappingExposure = 1.3

    const context = renderer.getContext();

    if (this.stats) this.stats.setRenderPanel(context)

    return renderer;
  }

  private setPostProcess() {
    this.renderTarget = new WebGLRenderTarget(
      this.config.width,
      this.config.height,
      {
        generateMipmaps: false,
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        format: RGBFormat,
        encoding: sRGBEncoding
      }
    )

    this.postProcess = {
      renderPass: new RenderPass(this.scene, this.camera.instance),
      composer: new EffectComposer(this.renderer, this.renderTarget)
    }


    this.postProcess.composer.setSize(this.config.width, this.config.height)
    this.postProcess.composer.setPixelRatio(this.config.pixelRatio)
    this.postProcess.composer.addPass(this.postProcess.renderPass)
  }

}
