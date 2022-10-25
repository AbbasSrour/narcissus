import { Spherical, Vector2, Vector3 } from "three"

export default interface View {
  spherical: {
    value: Spherical,
    smoothed: Vector3,
    smoothing: number,
    limits: {
      radius: {
        min: number,
        max: number
      },
      phi: {
        min: number,
        max: number
      },
      theta: {
        min: number,
        max: number
      }
    }
  },
  target: {
    value: Vector3,
    smoothed: Vector3,
    smoothing: number,
    limits: {
      x: {
        min: number,
        max: number
      }
      y: {
        min: number,
        max: number
      },
      z: {
        min: number,
        max: number
      }
    }
  },
  drag: {
    delta: {
      x: number,
      y: number
    }
    previous: {
      x: number,
      y: number
    }
    sensitivity: number,
    alternative: boolean,
  }
  zoom: {
    sensitivity: number,
    delta: number
  },
  down: (x: number, y: number) => void,
  move: (x: number, y: number) => void,
  up: () => void,
  zoomIn: (delta: number) => void,
  onMouseDown: (event: Event) => void,
  onMouseMove: (event: Event) => void,
  onMouseUp: (event: Event) => void,
  onTouchStart: (event: Event) => void,
  onTouchMove: (event: Event) => void,
  onTouchEnd: (event: Event) => void,
  onContextMenu: (event: Event) => void,
  onWheel: (event: Event) => void
}
