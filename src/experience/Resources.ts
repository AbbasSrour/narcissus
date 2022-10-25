import {EventEmitter} from "events";
import * as three from "three"
import {AssetType} from "./assets";
import Loaders from './utils/Loaders'

interface Items {
  [key: string]: any;
}

interface Group {
  loaded: Array<object>;
  assets: Array<AssetType>;
  current: any;
}

export default class Resources extends EventEmitter {
  private items: Items;
  private loader: Loaders;
  private groups: Group;

  constructor(assets: any) {
    super();

    // Items (will contain every resource)
    this.items = {}

    // Loader
    this.loader = new Loaders(); // TODO:

    this.groups = {
      loaded: [],
      assets,
      current: null
    }
    this.loadNextGroup();

    // Loader file end event
    this.loader.on('fileEnd', (resource: AssetType, data: any) => {
      if (resource.type === 'texture') {
        if (!(data instanceof three.Texture)) data = new three.Texture(data);
        data.needsUpdate = true
      }

      this.items[resource.name] = data

      this.groups.current.loaded++
      this.emit('progress', this.groups.current, resource, data)
    })

    // Loader all end event
    this.loader.on('end', () => {
      this.groups.loaded.push(this.groups.current)

      // Trigger
      this.emit('groupEnd', this.groups.current)

      if (this.groups.assets.length > 0) {
        this.loadNextGroup()
      } else {
        this.emit('end')
      }
    })
  }

  loadNextGroup() {
    this.groups.current = this.groups.assets.shift()
    this.groups.current.toLoad = this.groups.current.items.length
    this.groups.current.loaded = 0
    this.loader.load(this.groups.current.items)
  }

  createInstanceMeshes(children: any, _groups: any) {
    const groups = [];

    for (const _group of _groups) {
      groups.push({
        name: _group.name,
        regex: _group.regex,
        meshesGroups: [],
        instancedMeshes: []
      })
    }

    const result: { [key: string]: any } = {};
    for (const group of groups) {
      result[group.name] = group.instancedMeshes
    }

    return result;
  }

  destroy() {
    for (const itemKey in this.items) {
      const item = this.items[itemKey]
      if (item instanceof three.Texture) item.dispose()
    }
  }
}
