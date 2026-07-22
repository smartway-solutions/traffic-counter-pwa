import type {
  IFeedbackEventConfig,
  TSoundEffect,
  TVibrationLevel
} from "../../../types.ts";

export type TFeedbackPlaybackStatus = "played" | "off" | "unsupported";

export interface IFeedbackPlaybackResult {
  vibration: TFeedbackPlaybackStatus;
  sound: TFeedbackPlaybackStatus;
}

interface IToneStep {
  frequency: number;
  offsetSeconds: number;
  durationSeconds: number;
  oscillatorType: OscillatorType;
  gain: number;
}

const VIBRATION_PATTERNS: Record<TVibrationLevel, readonly number[]> = {
  off: [],
  light: [18],
  medium: [48],
  strong: [90, 45, 90]
};

const SOUND_PATTERNS: Record<Exclude<TSoundEffect, "off">, readonly IToneStep[]> = {
  click: [
    { frequency: 880, offsetSeconds: 0, durationSeconds: 0.045, oscillatorType: "sine", gain: 0.08 }
  ],
  beep: [
    { frequency: 440, offsetSeconds: 0, durationSeconds: 0.085, oscillatorType: "sine", gain: 0.09 }
  ],
  chime: [
    { frequency: 660, offsetSeconds: 0, durationSeconds: 0.07, oscillatorType: "sine", gain: 0.08 },
    { frequency: 880, offsetSeconds: 0.085, durationSeconds: 0.1, oscillatorType: "sine", gain: 0.075 }
  ],
  warning: [
    { frequency: 190, offsetSeconds: 0, durationSeconds: 0.12, oscillatorType: "square", gain: 0.055 },
    { frequency: 130, offsetSeconds: 0.15, durationSeconds: 0.18, oscillatorType: "square", gain: 0.05 }
  ]
};

let audioContext: AudioContext | null = null;

export function getFeedbackSupport(): { vibration: boolean; sound: boolean } {
  return {
    vibration: typeof navigator.vibrate === "function",
    sound: typeof window.AudioContext !== "undefined"
  };
}

function playVibration(level: TVibrationLevel): TFeedbackPlaybackStatus {
  if (level === "off") {
    return "off";
  }
  if (typeof navigator.vibrate !== "function") {
    return "unsupported";
  }

  navigator.vibrate([...VIBRATION_PATTERNS[level]]);
  return "played";
}

async function getAudioContext(): Promise<AudioContext | null> {
  if (typeof window.AudioContext === "undefined") {
    return null;
  }
  audioContext ??= new AudioContext();
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }
  return audioContext;
}

async function playSound(effect: TSoundEffect): Promise<TFeedbackPlaybackStatus> {
  if (effect === "off") {
    return "off";
  }

  const context = await getAudioContext();
  if (context === null) {
    return "unsupported";
  }

  const startAt = context.currentTime + 0.01;
  for (const step of SOUND_PATTERNS[effect]) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const toneStart = startAt + step.offsetSeconds;
    const toneEnd = toneStart + step.durationSeconds;

    oscillator.type = step.oscillatorType;
    oscillator.frequency.setValueAtTime(step.frequency, toneStart);
    gain.gain.setValueAtTime(0.0001, toneStart);
    gain.gain.exponentialRampToValueAtTime(step.gain, toneStart + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, toneEnd);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(toneStart);
    oscillator.stop(toneEnd + 0.01);
  }

  return "played";
}

export async function triggerFeedback(
  config: IFeedbackEventConfig
): Promise<IFeedbackPlaybackResult> {
  const vibration = playVibration(config.vibration);
  try {
    const sound = await playSound(config.sound);
    return { vibration, sound };
  } catch (error) {
    console.error("音效播放失敗", error);
    return { vibration, sound: "unsupported" };
  }
}
