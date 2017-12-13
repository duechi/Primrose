window.AudioContext = (function(AC) {
  Object.defineProperties(AC.prototype, {
    createGain: {
      value: AC.prototype.createGain || AC.prototype.createGainNode
    },
    createDelay: {
      value: AC.prototype.createDelay|| AC.prototype.createDelayNode
    },
    createScriptProcessor: {
      value: AC.prototype.createScriptProcessor || AC.prototype.createJavaScriptNode
    }
  });

  var testContext = new AC(),
    OscillatorNode = testContext.createOscillator().constructor,
    BufferSourceNode = testContext.createBufferSource().constructor,
    GainNodeGainValue = testContext.createGain().gain.constructor;

  Object.defineProperties(OscillatorNode.prototype, {
    setPeriodicWave: {
      value: OscillatorNode.prototype.setPeriodicWave || OscillatorNode.prototype.setWaveTable
    },
    start: {
      value: OscillatorNode.prototype.start || OscillatorNode.prototype.noteOn
    },
    stop: {
      value: OscillatorNode.prototype.stop || OscillatorNode.prototype.noteOff
    }
  });

  Object.defineProperties(BufferSourceNode.prototype, {
    start: {
      value: BufferSourceNode.prototype.start || function start() {
        return arguments.length > 1
          ? BufferSourceNode.prototype.noteGrainOn.apply(this, arguments)
          : BufferSourceNode.prototype.noteOn.apply(this, arguments);
      }
    },
    stop: {
      value: BufferSourceNode.prototype.stop || BufferSourceNode.prototype.noteOff
    }
  });

  Object.defineProperties(GainNodeGainValue.prototype, {
    setTargetAtTime: {
      value: GainNodeGainValue.prototype.setTargetAtTime || GainNodeGainValue.prototype.setTargetValueAtTime
    }
  });

  return AC;
})(window.AudioContext || window.webkitAudioContext);
