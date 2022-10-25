import {EventEmitter} from "events";
import {BufferGeometry, CompressedTexture, DataTexture, Group} from "three";
import {GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'
import {BasisTextureLoader} from 'three/examples/jsm/loaders/BasisTextureLoader.js'
import {AssetType} from "../assets";
import Experience from "../Experience";

interface Loader {
  extensions: Array<string>;
  //TODO fix
  // eslint-disable-next-line @typescript-eslint/ban-types
  action: Function;
}

interface Items {
  [key: string]: any
}

export default class Loaders extends EventEmitter {
  private loaders: Array<Loader>;
  private experience: Experience;
  private loaded: number;
  private queue: number;
  private items: Items;

  constructor() {
    super();

    this.experience = Experience.Instance;
    this.loaders = new Array<Loader>();
    this.loaded = 0;
    this.queue = 0;
    this.items = {};

    this.setLoaders();
  }

  public load(resources: Array<AssetType>) {
    for (const resource of resources) {
      this.queue++
      const extensionMatch = resource.source.match(/\.([a-z]+)$/)

      if (extensionMatch && typeof extensionMatch[1] !== 'undefined') {
        const assetExtension = extensionMatch[1]
        const loader = this.loaders.find((loader) => loader.extensions.find((extension) => extension === assetExtension))
        if (loader) loader.action(resource)
        else console.warn(`Cannot found loader for ${resource}`)
      } else {
        console.warn(`Cannot find extension of ${resource}`)
      }
    }
  }

  private setLoaders() {
    // Images
    this.loaders.push({
      extensions: ['jpg', 'png'],
      action: (resource: AssetType) => {
        const image = new Image();
        image.addEventListener('load', () => {
          this.fileLoadEnd(resource, image)
        })
        image.addEventListener('error', () => {
          this.fileLoadEnd(resource, image)
        })
        image.src = resource.source
      }
    })

    // Basis images
    const basisLoader = new BasisTextureLoader()
    basisLoader.setTranscoderPath('basis')
    basisLoader.detectSupport(this.experience.renderer.renderer)
    this.loaders.push({
      extensions: ['basis'],
      action: (resource: AssetType) => {
        basisLoader.load(resource.source, (data: CompressedTexture) => {
          this.fileLoadEnd(resource, data)
        })
      }
    })

    // Draco
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('draco/')
    dracoLoader.setDecoderConfig({type: 'js'})
    this.loaders.push({
      extensions: ['drc'],
      action: (resource: AssetType) => {
        dracoLoader.load(resource.source, (data: BufferGeometry) => {
          this.fileLoadEnd(resource, data)
          dracoLoader.dispose()
        })
      }
    })

    // GLTF
    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)
    this.loaders.push({
      extensions: ['glb', 'gltf'],
      action: (resource: AssetType) => {
        gltfLoader.load(resource.source, (data: GLTF) => {
          this.fileLoadEnd(resource, data)
        })
      }
    })

    // FBX
    const fbxLoader = new FBXLoader()
    this.loaders.push({
      extensions: ['fbx'],
      action: (resource: AssetType) => {
        fbxLoader.load(resource.source, (data: Group) => {
          this.fileLoadEnd(resource, data)
        })
      }
    })

    // RGBE | HDR
    const rgbeLoader = new RGBELoader()
    this.loaders.push({
      extensions: ['hdr'],
      action: (resource: AssetType) => {
        rgbeLoader.load(resource.source, (data: DataTexture) => {
          this.fileLoadEnd(resource, data)
        })
      }
    })
  }

  private fileLoadEnd(resource: AssetType, data: any) {
    this.loaded++;
    this.items[resource.name] = data;
    this.emit('fileEnd', resource, data);
    if (this.loaded === this.queue) this.emit('end')
  }
}
