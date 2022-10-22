import { Scene } from "three";
import Experience from "./Experience";
import Resources from "./Resources";
import Config from "./types/Config";

export default class World {
  private experience: Experience;
  private config: Config;
  private scene: Scene;
  private resources: Resources;

  constructor() {
    this.experience = Experience.Instance;
    this.config = this.experience.config
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.resources.on('groupEnd', (_group) => {
      if (_group.name === 'base') {
        this.setBaked()
        this.setGoogleLeds()
        this.setLoupedeckButtons()
        this.setCoffeeSteam()
        this.setTopChair()
        this.setElgatoLight()
        this.setBouncingLogo()
        this.setScreens()
      }
    })
  }

  setBaked() {
    this.baked = new Baked()
  }

  setGoogleLeds() {
    this.googleLeds = new GoogleLeds()
  }

  setLoupedeckButtons() {
    this.loupedeckButtons = new LoupedeckButtons()
  }

  setCoffeeSteam() {
    this.coffeeSteam = new CoffeeSteam()
  }

  setTopChair() {
    this.topChair = new TopChair()
  }

  setElgatoLight() {
    this.elgatoLight = new ElgatoLight()
  }

  setBouncingLogo() {
    this.bouncingLogo = new BouncingLogo()
  }

  setScreens() {
    this.pcScreen = new Screen(
      this.resources.items.pcScreenModel.scene.children[0],
      '/assets/videoPortfolio.mp4'
    )
    this.macScreen = new Screen(
      this.resources.items.macScreenModel.scene.children[0],
      '/assets/videoStream.mp4'
    )
  }

  resize() {
  }

  update() {
    if (this.googleLeds)
      this.googleLeds.update()

    if (this.loupedeckButtons)
      this.loupedeckButtons.update()

    if (this.coffeeSteam)
      this.coffeeSteam.update()

    if (this.topChair)
      this.topChair.update()

    if (this.bouncingLogo)
      this.bouncingLogo.update()
  }

  destroy() {
  }
}
