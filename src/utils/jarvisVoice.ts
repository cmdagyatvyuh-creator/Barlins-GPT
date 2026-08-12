// JARVIS Tactical Voice & Speech Synthesis System (Hindi & English)

export interface VoiceConfig {
  enabled: boolean;
  autoRead: boolean;
  lang: 'auto' | 'hi-IN' | 'en-GB' | 'en-US';
  rate: number;
  pitch: number;
  volume: number;
  jarvisFx: boolean;
  voiceMode: 'jarvis-male' | 'hindi-female' | 'custom';
  selectedVoiceURI?: string;
}

export class JarvisVoiceSystem {
  public config: VoiceConfig = {
    enabled: true,
    autoRead: true,
    lang: 'auto',
    rate: 0.95, 
    pitch: 0.85, // Heavy JARVIS tone
    volume: 1.0,
    jarvisFx: true,
    voiceMode: 'jarvis-male', // Default: Heavy Male JARVIS Voice
    selectedVoiceURI: '',
  };

  private synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private voices: SpeechSynthesisVoice[] = [];
  public isSpeaking: boolean = false;
  private onSpeakingStateChange?: (speaking: boolean) => void;

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (!this.synth) return;
    
    const updateVoices = () => {
      this.voices = this.synth?.getVoices() || [];
    };

    updateVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = updateVoices;
    }
  }

  public setSpeakingCallback(cb: (speaking: boolean) => void) {
    this.onSpeakingStateChange = cb;
  }

  // Get available Hindi and English voices
  public getVoicesList() {
    if (this.voices.length === 0) this.initVoices();
    return this.voices;
  }

  // Clean raw markdown, code blocks, URLs for crystal clear speech
  private cleanTextForSpeech(text: string): string {
    if (!text || typeof text !== 'string') return '';
    return text
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, ' [Code Snippet Executed] ')
      // Remove inline code
      .replace(/`([^`]+)`/g, '$1')
      // Remove URLs
      .replace(/https?:\/\/\S+/g, 'link')
      // Remove markdown headers and symbols
      .replace(/[#*_\-[\]()]/g, ' ')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Detect if text contains Hindi Devanagari script or Hinglish words
  public containsHindi(text: string): boolean {
    if (!text || typeof text !== 'string') return false;
    // Check Devanagari Unicode range
    if (/[\u0900-\u097F]/.test(text)) return true;

    // Check common Hinglish words
    const hindiWordsRegex = /\b(namaste|kaise|kaisa|kya|haan|nahi|karo|batao|shukriya|dhanyawad|samjh|karo|raha|rahi|hai|ho|hun|mora|dost|bhai|apna|aap|apka|suno|kaha|gaya|achha|thik|pata|bol|bolo|sunao|kuch|mere|merain)\b/i;
    return hindiWordsRegex.test(text);
  }

  // Select optimal voice for JARVIS (English or Pure Native Hindi)
  private selectBestVoice(isHindi: boolean): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) this.initVoices();

    // 1. Custom voice selected by user
    if (this.config.selectedVoiceURI) {
      const custom = this.voices.find(v => v.voiceURI === this.config.selectedVoiceURI || v.name === this.config.selectedVoiceURI);
      if (custom) return custom;
    }

    // 2. Hindi Language Text -> PRIORITIZE Pure Native Hindi Voice (hi-IN)
    if (isHindi) {
      // Look for pure native Hindi voices first
      const nativeHindi = this.voices.find(v => 
        v.lang.toLowerCase().startsWith('hi') || 
        v.lang.toLowerCase().includes('hi-in') ||
        v.name.toLowerCase().includes('hindi') || 
        v.name.includes('हिन्दी') ||
        v.name.includes('Swara') ||
        v.name.includes('Hemant') ||
        v.name.includes('Kalpana') ||
        v.name.includes('Madhur')
      );
      if (nativeHindi) return nativeHindi;

      // Fallback for Hindi text if no pure hi-IN voice exists on browser: Indian accent English voice
      const indianVoice = this.voices.find(v => v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().includes('in') || v.name.toLowerCase().includes('india'));
      if (indianVoice) return indianVoice;
    }

    // 3. English Language Text -> Heavy Male JARVIS voice selection
    const ukMale = this.voices.find(v => 
      (v.lang.startsWith('en')) && 
      (v.name.includes('Google UK English Male') || v.name.includes('Daniel') || v.name.includes('George') || v.name.includes('Arthur') || v.name.includes('Guy') || v.name.includes('David'))
    );
    if (ukMale) return ukMale;

    const anyMaleEn = this.voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('male'));
    if (anyMaleEn) return anyMaleEn;

    // Fallback best English / system voices
    const preferredEnglish = this.voices.find(v => v.lang.startsWith('en'));
    return preferredEnglish || this.voices[0] || null;
  }

  // Main Speech Output
  public speak(text: string, forceLang?: 'hi-IN' | 'en-GB' | 'en-US', onEnd?: () => void) {
    if (!this.synth || !this.config.enabled) return;

    // Stop existing speech
    this.stop();

    const cleanedText = this.cleanTextForSpeech(text);
    if (!cleanedText) return;

    // Determine language
    const isHindi = forceLang === 'hi-IN' || 
      this.config.lang === 'hi-IN' || 
      (this.config.lang === 'auto' && this.containsHindi(cleanedText));

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    const selectedVoice = this.selectBestVoice(isHindi);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = isHindi ? 'hi-IN' : 'en-US';
    }

    // Natural rate & pitch tuning
    // For Hindi, pitch < 0.9 causes robotic/foreign artifacts; pitch = 1.0 ensures smooth native pronunciation
    utterance.rate = isHindi ? 0.95 : this.config.rate;
    utterance.pitch = isHindi ? 1.0 : this.config.pitch;
    utterance.volume = this.config.volume;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.onSpeakingStateChange) this.onSpeakingStateChange(true);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      if (this.onSpeakingStateChange) this.onSpeakingStateChange(false);
    }
  }

  // Play quick JARVIS system intro test phrase
  public testVoice(mode: 'hindi' | 'english' = 'english') {
    if (mode === 'hindi') {
      this.speak("नमस्ते सर! मैं बार्लिन जी पी टी हूँ। अब मेरी हिंदी आवाज़ एकदम स्पष्ट, सहज और साफ़ है। बताइए, मैं आपकी क्या मदद करूँ?", 'hi-IN');
    } else {
      this.speak("Greetings, Sir. I am Barlin's GPT. Speech synthesis and tactical communication channels are operating at full capacity. How may I assist you today?", 'en-GB');
    }
  }

  // Play Wolf Mode Welcome Speech
  public speakWolfActivation(onEnd?: () => void) {
    const text = "Welcome back, sir. Wolf Mode activated. Allow me to introduce myself, I am Barlins, a virtual artificial intelligence. Systems online. Data package installed. Initializing database. Backing up the configuration. Satellite connection established. Ready for your command, sir.";
    this.speak(text, 'en-GB', onEnd);
  }

  // Play Normal Mode Welcome Speech
  public speakNormalActivation(onEnd?: () => void) {
    const text = "Normal Mode activated. Barlins standard operating protocol restored. Formal AI assistant safeguards active. Ready for your command, sir.";
    this.speak(text, 'en-GB', onEnd);
  }
}

export const jarvisVoice = new JarvisVoiceSystem();
