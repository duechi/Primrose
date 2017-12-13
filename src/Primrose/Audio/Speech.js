import BasePlugin from "../BasePlugin";

/*
pliny.class({
  parent: "Primrose.Audio",
  baseClass: "Primrose.BasePlugin",
  name: "Speech",
  description: "Installs a text-2-speech engine in the BrowserEnvironment"
});
*/
export default class Speech extends BasePlugin {
  constructor (options) {
    super("Text2Speech", options, {
      remoteVoices: true,
      volume: 1,
      rate: 1,
      pitch: 1,
      voice: 0
    });

    if(Speech.isAvailable) {
      const getVoices = () => {
        this.voices = speechSynthesis
          .getVoices()
          .filter((v) => this.options.remoteVoices || v.default || v.localService);
        this.voiceNames = this.voices.map((voice) => voice.name);
      };

      getVoices();
      speechSynthesis.onvoiceschanged = getVoices;
    }
  }

  get requirements() {
    return [];
  }

  install(env) {
    env.speech = this;
  }

  static get isAvailable () {
    return !!window.speechSynthesis;
  }

  get speaking(){
    return Speech.isAvailable && speechSynthesis.speaking;
  }

  speak(txt, opts) {
    if(Speech.isAvailable) {
      return new Promise((resolve, reject) => {
        var msg = new SpeechSynthesisUtterance();
        msg.voice = this.voices[opts && opts.voice || this.options.voice];
        msg.volume = opts && opts.volume || this.options.volume;
        msg.rate = opts && opts.rate || this.options.rate;
        msg.pitch = opts && opts.pitch || this.options.pitch;
        msg.text = txt;
        msg.onend = resolve;
        msg.onerror = reject;
        speechSynthesis.speak(msg);
      });
    }
    else{
      return Promise.reject();
    }
  }
};
