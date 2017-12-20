import BasePlugin from "../BasePlugin";

import Note from "./Note";

/*
pliny.class({
  parent: "Primrose.Audio",
  name: "Music",
  description: "A synthesizer that you can program to play notes."
});
*/

var MAX_NOTE_COUNT = (navigator.maxTouchPoints || 10) + 1,
  TYPES = ["sine",
    "square",
    "sawtooth",
    "triangle"
  ];

export default class Music extends BasePlugin {

  constructor(options) {
    super("Music", options, {
      numNotes: MAX_NOTE_COUNT
    });

    this.oscillators = {};
    this.isAvailable = false;
    this.audio = null;
    this.mainVolume = null;
    this.numNotes = 0;
    this._type = null;

  }

  get requirements() {
    return ["audio"];
  }

  _install(env) {
    env.music = this;
    this.audio = env.audio;
    this.audio.ready.then(() => {
      const ctx = this.audio.context;
      this.mainVolume = ctx.createGain();
      this.mainVolume.connect(this.audio.mainVolume);
      this.mainVolume.gain.setValueAtTime(1, 0);
      this.numNotes = this.options.numNotes;
      TYPES.forEach((type) => {
        const oscs = this.oscillators[type] = [];
        this[type] = this.play.bind(this, type);
        for (var i = 0; i < this.numNotes; ++i) {
          oscs.push(new Note(ctx, this.mainVolume, type));
        }
      });
      this.isAvailable = true;
    });
  }

  get type() {
    return this._type;
  }

  set type(v){
    if(this.isAvailable){
      this._type = v;
      this.oscillators.forEach((o) =>
        o.osc.type = this._type);
    }
  }

  getOsc(type){
    const osc = this.oscillators[type];
    let n;
    for(n = 0; n < osc.length; ++n){
      if(osc[n].ready){
        break;
      }
    }

    return osc[n % this.numNotes];
  }

  play (type, i, volume, duration, dt) {
    if(dt === undefined){
      dt = 0;
    }
    const o = this.getOsc(type)
      .on(i, volume, dt);
    dt += duration;
    o.off(dt);
    dt = this.audio.context.currentTime + dt - performance.now() / 1000;
    return o;
  }
}

Music.TYPES = TYPES;
