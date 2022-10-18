import { EventEmitter } from "events";
import Experience from "../Experience";

interface Loader {
  extensions: Array<String>;
  action: Function;
}

export default class Loaders extends EventEmitter {
  loaders: Array<Loader>;
  private experience: Experience;
  private loaded: number;
  private queue: number;

  constructor() {
    super();
    this.experience = Experience.Instance;
    this.loaders = [];
    this.loaded = 0;
    this.queue = 0;
    this.setLoaders();
  }

  setLoaders() {
    this.loaders.push({
      extensions: ['jpg', 'png'],
      action: (resource: any) => {
        const image = new Image();
        image.addEventListener('load', () => {
          this.fileLoadEnd(resource, image)
        })
      }
    })
  }

  //TODO
  fileLoadEnd(resource: any, data: any) {
    this.loaded++;
    this.items[resource.name] = data;
    this.emit('loaded');
    if(this.loaded===this.queue) this.emit('ready')
  }
}
