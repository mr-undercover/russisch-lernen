// Audio-Engine: Synthetisierte Soundeffekte via Web Audio API + Sprachausgabe via Web Speech API
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type, duration, startTime = 0, gainLevel = 0.15) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

      gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + startTime);
      osc.stop(this.ctx.currentTime + startTime + duration);
    } catch (e) {
      console.warn("AudioContext error:", e);
    }
  }

  // Richtige Antwort: Fröhlicher Zweiklang (Duolingo-Stil)
  playCorrect() {
    if (!this.enabled) return;
    this.init();
    this.playTone(523.25, 'sine', 0.15, 0, 0.18);     // C5
    this.playTone(659.25, 'sine', 0.25, 0.1, 0.22);    // E5
    this.playTone(783.99, 'sine', 0.35, 0.18, 0.25);   // G5
  }

  // Falsche Antwort: Sanfter Doppel-Bassboop
  playWrong() {
    if (!this.enabled) return;
    this.init();
    this.playTone(196.00, 'triangle', 0.18, 0, 0.25);  // G3
    this.playTone(164.81, 'triangle', 0.25, 0.12, 0.28); // E3
  }

  // Klickgeräusch für Knöpfe & Kacheln
  playClick() {
    if (!this.enabled) return;
    this.init();
    this.playTone(400, 'triangle', 0.04, 0, 0.08);
  }

  // Herz verloren
  playHeartLost() {
    if (!this.enabled) return;
    this.init();
    this.playTone(330, 'sawtooth', 0.15, 0, 0.15);
    this.playTone(260, 'sawtooth', 0.25, 0.12, 0.18);
  }

  // Lektion abgeschlossen / Level Up / Fanfare
  playCelebration() {
    if (!this.enabled) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.25, idx * 0.12, 0.22);
    });
  }

  // Neuer Streak-Tag
  playStreak() {
    if (!this.enabled) return;
    this.init();
    this.playTone(440, 'sine', 0.12, 0, 0.18);
    this.playTone(554.37, 'sine', 0.12, 0.1, 0.20);
    this.playTone(659.25, 'sine', 0.28, 0.2, 0.25);
  }
}

class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.russianVoice = null;
    this.hasRussianVoice = false;
    this.enabled = true;
    this.rate = 0.85; // Leicht langsamer für Anfänger
    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;
    const findVoice = () => {
      const voices = this.synth.getVoices();
      // Suche ru-RU Stimme
      this.russianVoice = voices.find(v => v.lang === 'ru-RU' || v.lang === 'ru_RU' || v.lang.startsWith('ru'));
      this.hasRussianVoice = !!this.russianVoice;
    };
    findVoice();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = findVoice;
    }
  }

  speak(text, customRate = null) {
    if (!this.enabled) return false;
    if (!this.synth) {
      if (window.app) window.app.showToast("Dieser Browser unterstützt keine Sprachausgabe. Nutze einen aktuellen Browser mit Web Speech API.", "🔊");
      return false;
    }
    try {
      this.synth.cancel(); // Vorherige Sprache abbrechen
      const cleanText = text.replace(/[\(\)\[\]\/]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ru-RU';
      utterance.rate = customRate || this.rate;

      if (this.russianVoice) {
        utterance.voice = this.russianVoice;
      } else if (!this.voiceNoticeShown) {
        this.voiceNoticeShown = true;
        if (window.app) window.app.showToast("Keine russische Systemstimme gefunden. Die ru-RU-Systemstimme wird versucht; installiere bei Bedarf ein russisches Sprachpaket.", "🇷🇺");
      }

      utterance.onerror = event => {
        const reason = event.error || "unbekannter Fehler";
        console.warn("SpeechSynthesis playback error:", reason);
        this.lastError = reason;
        if (window.app) window.app.showToast(`Sprachausgabe fehlgeschlagen (${reason}). Prüfe, ob eine russische Stimme installiert ist.`, "🔊");
      };
      utterance.onstart = () => { this.lastError = null; this.lastPlaybackAt = Date.now(); };

      this.synth.speak(utterance);
      return true;
    } catch (e) {
      console.warn("SpeechSynthesis error:", e);
      if (window.app) window.app.showToast("Die russische Sprachausgabe konnte nicht gestartet werden.", "🔊");
      return false;
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

// Globale Instanzen
// Consumers use window.sfx/window.speech throughout the app; explicit window
// assignments are required because top-level `const` declarations are lexical globals.
window.sfx = new SoundEffects();
window.speech = new SpeechEngine();
