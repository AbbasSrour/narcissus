import * as THREE from 'three'
import Experience from '../Experience'

export default class ElgatoLight {
  constructor() {
    this.experience = Experience.Instance
    this.resources = this.experience.resources
    this.scene = this.experience.scene

    this.setModel()
  }

  setModel() {
    this.model = {}

    this.model.mesh = this.resources.items.elgatoLightModel.scene.children[0]
    this.scene.add(this.model.mesh)

    this.model.mesh.material = new THREE.MeshBasicMaterial({
      color: 0xffffff
    })
  }
}
