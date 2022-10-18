import { EventEmitter } from "events";

export default class Time extends EventEmitter {
  start: number;
  current: number;
  elapsed: number;
  delta: number;
  playing: boolean;
  ticker: number | undefined;

  constructor() {
    super();
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;
    this.playing = true
    this.tick = this.tick.bind(this)

    this.tick()
  }

  public play() {
    this.playing = true
  }

  public pause() {
    this.playing = false;
  }

  public stop() {
    if (this.ticker)
      window.cancelAnimationFrame(this.ticker);
  }

  private tick() {
    this.ticker = window.requestAnimationFrame(this.tick)
    const current = Date.now();

    this.delta = current - this.current
    this.elapsed += this.playing ? this.delta : 0;

    if (this.delta > 60) {
      this.delta = 60
    }

    if (this.playing) {
      this.emit('tick')
    }
  }
}
