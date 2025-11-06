
class AudioService {
  private audioContext: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private playTone(frequency: number, duration: number, startTime: number = 0, gain: number = 0.1) {
    try {
      const context = this.getContext();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      gainNode.gain.setValueAtTime(gain, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.start(context.currentTime + startTime);
      oscillator.stop(context.currentTime + startTime + duration);
    } catch (e) {
      console.error("Audio playback failed:", e);
    }
  }

  playCorrectSound() {
    this.playTone(523.25, 0.1, 0); // C5
    this.playTone(659.25, 0.1, 0.1); // E5
    this.playTone(783.99, 0.1, 0.2); // G5
  }

  playWrongSound() {
    this.playTone(164.81, 0.2, 0); // E3
    this.playTone(155.56, 0.2, 0.1); // D#3
  }

  playStreakSound() {
    for (let i = 0; i < 5; i++) {
      this.playTone(880 + i * 100, 0.05, i * 0.05, 0.15);
    }
  }

  playGameStartSound() {
    this.playTone(523.25, 0.15, 0); // C5
    this.playTone(783.99, 0.15, 0.2); // G5
    this.playTone(1046.50, 0.3, 0.4); // C6
  }

  playWinSound() {
    this.playTone(783.99, 0.2, 0); // G5
    this.playTone(987.77, 0.2, 0.25); // B5
    this.playTone(1174.66, 0.5, 0.5); // D6
  }
  
  playTickSound() {
    this.playTone(800, 0.05, 0, 0.05); // Lower frequency and volume
  }
}

export const audioService = new AudioService();