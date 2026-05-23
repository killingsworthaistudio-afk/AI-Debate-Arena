import { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Flame, 
  Zap, 
  Cpu, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  AlertCircle, 
  ChevronRight, 
  Award,
  Eye,
  EyeOff
} from 'lucide-react';

interface DebateRound {
  speaker: 'KAI' | 'NATALIE';
  argument: string;
}

interface DebateData {
  topic: string;
  sideA: string;
  sideB: string;
  rounds: DebateRound[];
  winner: string | null;
}

export default function DebateArena() {
  // Input states & Keys
  const [topic, setTopic] = useState('');
  const [elKey, setElKey] = useState(() => localStorage.getItem('arena_el_key') || '');
  
  // UI preferences
  const [showElPassword, setShowElPassword] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);

  // Core App states
  const [debate, setDebate] = useState<DebateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [visibleRounds, setVisibleRounds] = useState(0);
  const [showVote, setShowVote] = useState(false);
  const [userVote, setUserVote] = useState<'KAI' | 'NATALIE' | null>(null);
  const [error, setError] = useState('');

  // Audio elements
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isDebatingRef = useRef(false);

  // Pre-set chips
  const examples = [
    "Chipotle vs Whataburger",
    "Cats vs Dogs",
    "Coffee vs Energy Drinks",
    "Remote Work vs Office",
    "Marvel vs DC"
  ];

  // Injected CSS and styling
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'cyberpunk-debate-styles';
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
      
      body {
        background-color: #050510;
        color: #e0e0ff;
        font-family: 'Share Tech Mono', monospace;
      }

      .sleek-title {
        text-shadow: 2px 2px 0px #ff6b00, -2px -2px 0px #00f5d4;
      }

      .cyber-glow-cyan {
        box-shadow: 0 0 15px rgba(0, 245, 212, 0.4);
        border-color: #00f5d4;
      }

      .cyber-glow-orange {
        box-shadow: 0 0 15px rgba(255, 107, 0, 0.4);
        border-color: #ff6b00;
      }

      .font-orbitron {
        font-family: 'Orbitron', sans-serif;
      }

      .font-mono-tech {
        font-family: 'Share Tech Mono', monospace;
      }

      /* Cyberpunk keyframes & animations */
      @keyframes glitch {
        0%, 94% {
          text-shadow: 2.5px 2.5px 0px #ff6b00, -2.5px -2.5px 0px #00f5d4;
        }
        95% {
          text-shadow: -3px -1px 0 rgba(255, 60, 0, 0.8),
                      2px 2px 0 rgba(0, 255, 150, 0.8);
          transform: skew(1deg);
        }
        97% {
          text-shadow: 3px 2px 0 rgba(255, 60, 0, 0.9),
                      -3px -1px 0 rgba(0, 255, 150, 0.9);
          transform: skew(-1deg);
        }
        100% {
          text-shadow: 2px 2px 0px #ff6b00, -2px -2px 0px #00f5d4;
        }
      }

      @keyframes flicker {
        0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
          opacity: 0.99;
          filter: drop-shadow(0 0 4px rgba(0, 180, 216, 1));
        }
        20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
          opacity: 0.35;
          filter: none;
        }
      }

      @keyframes cyberPulseCyan {
        0%, 100% {
          box-shadow: 0 0 6px rgba(0, 245, 212, 0.2), inset 0 0 4px rgba(0, 245, 212, 0.1);
        }
        50% {
          box-shadow: 0 0 16px rgba(0, 245, 212, 0.4), inset 0 0 10px rgba(0, 245, 212, 0.2);
        }
      }

      @keyframes cyberPulseOrange {
        0%, 100% {
          box-shadow: 0 0 6px rgba(255, 107, 0, 0.2), inset 0 0 4px rgba(255, 107, 0, 0.1);
        }
        50% {
          box-shadow: 0 0 16px rgba(255, 107, 0, 0.4), inset 0 0 10px rgba(255, 107, 0, 0.2);
        }
      }

      @keyframes cyberGridBackground {
        from { background-position: 0 0; }
        to { background-position: 0 40px; }
      }

      .glitch-title {
        animation: glitch 2s infinite linear alternate-reverse;
      }

      .flicker-purple {
        animation: flicker 4s infinite;
      }

      .pulse-cyan-glow {
        animation: cyberPulseCyan 2s infinite ease-in-out;
      }

      .pulse-orange-glow {
        animation: cyberPulseOrange 2s infinite ease-in-out;
      }

      .slide-left-enter {
        animation: slideLeft 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
      }

      .slide-right-enter {
        animation: slideRight 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
      }

      .fade-up-enter {
        animation: fadeUp 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
      }

      @keyframes slideLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes slideRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(15px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .cyber-scanlines::before {
        content: " ";
        display: block;
        position: absolute;
        top: 0; left: 0; bottom: 0; right: 0;
        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.04));
        z-index: 50;
        background-size: 100% 4px, 3px 100%;
        pointer-events: none;
        opacity: 0.45;
      }

      .grid-pattern {
        background-image: 
          linear-gradient(rgba(0, 180, 216, 0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 180, 216, 0.06) 1px, transparent 1px);
        background-size: 32px 32px;
      }
    `;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);

  // Save keys to localStorage on modification
  const handleElKeyChange = (val: string) => {
    setElKey(val);
    localStorage.setItem('arena_el_key', val);
  };

  // Perform Reset of Arena
  const resetArena = () => {
    isDebatingRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setDebate(null);
    setVisibleRounds(0);
    setShowVote(false);
    setUserVote(null);
    setError('');
  };

  // Sequential Playback loop with/without ElevenLabs TTS
  const playDebateRounds = async (debateData: DebateData) => {
    isDebatingRef.current = true;
    setVisibleRounds(0);
    setShowVote(false);
    setUserVote(null);

    // Pre-fetch available voice IDs dynamically if key is specified
    let availableVoices: any[] = [];
    const hasVoiceKey = elKey.trim().length > 0;
    if (hasVoiceKey && !voiceMuted) {
      try {
        const voicesRes = await fetch("https://api.elevenlabs.io/v1/voices", {
          method: "GET",
          headers: {
            "xi-api-key": elKey,
          },
        });
        if (voicesRes.ok) {
          const data = await voicesRes.json();
          availableVoices = data.voices || [];
          console.log("Successfully fetched ElevenLabs voices:", availableVoices.map((v: any) => `${v.name} (${v.voice_id})`));
        } else {
          console.warn(`Could not load voices list from ElevenLabs (Status ${voicesRes.status}). Using fallback configuration.`);
        }
      } catch (err) {
        console.warn("Could not reach ElevenLabs voices API:", err);
      }
    }

    for (let i = 0; i < 6; i++) {
      if (!isDebatingRef.current) break;

      // Unveil the current round card
      setVisibleRounds(i + 1);

      const currentRound = debateData.rounds[i];

      if (hasVoiceKey && !voiceMuted) {
        // Resolve target Voice ID dynamically based on returned voices list
        let voiceId = currentRound.speaker === 'KAI' 
          ? 'pNInz6obpgdq51uLL5Kx' // Adam (American English Male)
          : '21m00Tcm4TlvDq8ikWAM'; // Rachel (American Female)

        if (availableVoices && availableVoices.length > 0) {
          if (currentRound.speaker === 'KAI') {
            const hasAdam = availableVoices.find(v => v.voice_id === 'pNInz6obpgdq51uLL5Kx');
            if (hasAdam) {
              voiceId = 'pNInz6obpgdq51uLL5Kx';
            } else {
              const hasGeorge = availableVoices.find(v => v.voice_id === 'JBFvJZBaCD6m56WST5zY');
              if (hasGeorge) {
                voiceId = 'JBFvJZBaCD6m56WST5zY';
              } else {
                const maleVoice = availableVoices.find(v => {
                  const g = (v.labels?.gender || v.labels?.Gender || v.labels?.GENDER || '').toLowerCase();
                  return g.includes('male') || v.name?.toLowerCase() === 'adam' || v.name?.toLowerCase() === 'george';
                });
                if (maleVoice) {
                  voiceId = maleVoice.voice_id;
                } else if (availableVoices[0]) {
                  voiceId = availableVoices[0].voice_id;
                }
              }
            }
          } else {
            const hasRachel = availableVoices.find(v => v.voice_id === '21m00Tcm4TlvDq8ikWAM');
            if (hasRachel) {
              voiceId = '21m00Tcm4TlvDq8ikWAM';
            } else {
              const femaleVoice = availableVoices.find(v => {
                const g = (v.labels?.gender || v.labels?.Gender || v.labels?.GENDER || '').toLowerCase();
                return g.includes('female') || v.name?.toLowerCase() === 'rachel' || v.name?.toLowerCase() === 'bella';
              });
              if (femaleVoice) {
                voiceId = femaleVoice.voice_id;
              } else if (availableVoices[1] || availableVoices[0]) {
                voiceId = (availableVoices[1] || availableVoices[0]).voice_id;
              }
            }
          }
        }
        
        try {
          // Playback flow: Fetch TTS payload with retry on model mismatch
          let response;
          let attemptedModel = 'eleven_monolingual_v1';
          
          try {
            response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'xi-api-key': elKey,
              },
              body: JSON.stringify({
                text: currentRound.argument,
                model_id: attemptedModel,
                voice_settings: {
                  stability: 0.4,
                  similarity_boost: 0.8,
                },
              }),
            });
            
            // If the model fails or 400 is thrown, try 'eleven_multilingual_v2' immediately
            if (!response.ok) {
              console.warn(`ElevenLabs play failed with ${attemptedModel} (Code ${response.status}). Retrying with eleven_multilingual_v2...`);
              attemptedModel = 'eleven_multilingual_v2';
              response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'xi-api-key': elKey,
                },
                body: JSON.stringify({
                  text: currentRound.argument,
                  model_id: attemptedModel,
                  voice_settings: {
                    stability: 0.4,
                    similarity_boost: 0.8,
                  },
                }),
              });
            }
          } catch (modelErr) {
            console.warn("Direct model generation failed, attempting fallback...", modelErr);
          }

          if (!response || !response.ok) {
            throw new Error(`ElevenLabs error: Response code ${response ? response.status : 'unknown'}`);
          }

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);

          if (!isDebatingRef.current) {
            URL.revokeObjectURL(url);
            break;
          }

          // Play Audio Ref and wait for resolve
          await new Promise<void>((resolve) => {
            if (!audioRef.current) {
              resolve();
              return;
            }
            audioRef.current.src = url;
            audioRef.current.onended = () => {
              URL.revokeObjectURL(url);
              resolve();
            };
            audioRef.current.onerror = () => {
              URL.revokeObjectURL(url);
              resolve();
            };
            
            // Catch play abort / autoplay policy limits
            audioRef.current.play().catch((err) => {
              console.warn("Autoplay block or playback interrupted:", err);
              URL.revokeObjectURL(url);
              resolve();
            });
          });

          // Wait 300ms post audio end as demanded
          await new Promise((resolve) => setTimeout(resolve, 300));

        } catch (err) {
          console.error("ElevenLabs Audio play failed. Performing default silent wait.", err);
          // Standard fallback delay if ElevenLabs fails during live debate
          await new Promise((resolve) => setTimeout(resolve, 1600));
        }
      } else {
        // Silent presentation delay: 1600ms between rounds
        await new Promise((resolve) => setTimeout(resolve, 1600));
      }
    }

    if (isDebatingRef.current) {
      // Complete show timer to request user vote
      setTimeout(() => {
        if (isDebatingRef.current) {
          setShowVote(true);
        }
      }, 800);
    }
  };

  // Launch Debate Trigger
  const triggerDebate = async () => {
    if (!topic.trim()) {
      setError('Neural Protocol Aborted: Enter a debate topic to proceed.');
      return;
    }

    setLoading(true);
    setError('');
    setDebate(null);
    setVisibleRounds(0);
    setShowVote(false);
    setUserVote(null);

    setLoadingStep('Initializing Gemini neural model on host...');

    try {
      const response = await fetch('/api/debate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: topic.trim() })
      });

      if (!response.ok) {
        const errDetail = await response.json().catch(() => ({}));
        throw new Error(errDetail.error || `Neural feedback failed: Server returned ${response.status}`);
      }

      setLoadingStep('Compiling AI personalities...');
      const parsedDebate = await response.json();

      // Check structure sanity
      if (!parsedDebate.rounds || parsedDebate.rounds.length < 6) {
        throw new Error('Fragmented Debate: Model missed one or more debate arguments.');
      }

      setDebate(parsedDebate);
      setLoading(false);

      // Start serial playback
      playDebateRounds(parsedDebate);

    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Synapse Failure: Connection to the debate backend failed.');
      setLoading(false);
    }
  };

  // Helper animated equalizer component
  const renderEqualizer = (color: string) => {
    return (
      <div className="flex items-end gap-0.5 h-3.5 px-1.5 direct-equalizer">
        <div className="w-[2.5px] h-1.5 bg-current animate-bounce" style={{ animationDelay: '0.1s', animationDuration: '0.6s', color }} />
        <div className="w-[2.5px] h-3 bg-current animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '0.5s', color }} />
        <div className="w-[2.5px] h-2 bg-current animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '0.7s', color }} />
        <div className="w-[2.5px] h-1 bg-current animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '0.4s', color }} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050510] text-[#e0e0ff] font-mono flex flex-col p-4 md:p-6 lg:p-8 relative overflow-x-hidden grid-pattern cyber-scanlines">
      {/* Hidden Audio Player managed by React Reference */}
      <audio ref={audioRef} style={{ display: 'none' }} />

      {/* Main Layout Bounder to Sleek Theme Specs */}
      <div className="w-full max-w-7xl mx-auto flex flex-col flex-1 space-y-6" id="arena-main-wrapper">
        
        {/* Sleek Theme Header Stage */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#00b4d8] pb-4 gap-4" id="sleek-header">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-none italic uppercase glitch-title font-orbitron sleek-title select-none">
              DEBATE ARENA
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#00b4d8] mt-1 font-bold shadow-sm">
              LET THE AI FIGHT · YOU DECIDE
            </p>
          </div>

          {/* Key Configurations Floating Box */}
          <div className="flex flex-wrap gap-4 items-center w-full md:w-auto" id="config-uplinks">
            <div className="space-y-1">
              <label className="block text-[9px] uppercase text-[#555] font-bold tracking-wider">ElevenLabs Key</label>
              <div className="relative flex items-center">
                <input 
                  type={showElPassword ? "text" : "password"} 
                  value={elKey}
                  onChange={(e) => handleElKeyChange(e.target.value)}
                  placeholder="Optional API Key"
                  className="bg-[#0a0a20] border border-[#333] text-[10px] pl-2 pr-7 py-1.5 w-full sm:w-36 outline-none focus:border-[#ff6b00] text-[#e0e0ff] transition-colors font-mono"
                  id="el-key-input"
                />
                <button 
                  onClick={() => setShowElPassword(!showElPassword)}
                  className="absolute right-2 text-[#555] hover:text-orange-400 transition-colors"
                  id="toggle-el-password-btn"
                >
                  {showElPassword ? <EyeOff size={11} /> : <Eye size={11} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-3 md:mt-0 pt-0.5">
              <button 
                onClick={() => setVoiceMuted(!voiceMuted)} 
                className={`text-[9px] border px-2 py-1 font-extrabold uppercase transition-all tracking-wider flex items-center gap-1 ${
                  voiceMuted 
                    ? 'border-red-500/50 text-red-400 bg-red-950/20' 
                    : 'border-[#333] text-green-400 bg-green-950/10 hover:border-[#00f5d4]'
                }`}
                id="toggle-mute-btn"
              >
                {voiceMuted ? <VolumeX size={10} /> : <Volume2 size={10} />}
                <span>{voiceMuted ? 'MUTED' : 'VOICES'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Dilemma Selector Container (Sleek Theme style) */}
        {!debate && !loading && (
          <section className="flex flex-col md:flex-row gap-3 items-center w-full" id="dilemma-bar-station">
            <div className="w-full md:flex-1 relative">
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') triggerDebate(); }}
                className="w-full bg-[#101030] border-2 border-[#00b4d8] px-4 py-3.5 text-lg font-bold outline-none placeholder-[#333] tracking-normal focus:border-[#00f5d4] transition-all text-[#e0e0ff]" 
                placeholder="ENTER A TOPIC... (Example: Chipotle vs Whataburger)"
                id="topic-input"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 select-none pointer-events-none">
                <span className="px-2 py-1 bg-[#00b4d8] text-[10px] font-black uppercase text-white tracking-widest leading-none">
                  Ready
                </span>
              </div>
            </div>
            
            <button 
              onClick={triggerDebate}
              className="w-full md:w-auto bg-[#ff6b00] hover:bg-[#ff8533] text-white px-8 py-4 font-black uppercase italic tracking-wider transition-all shadow-[4px_4px_0px_#00b4d8] active:translate-y-0.5 active:shadow-[2px_2px_0px_#00b4d8]"
              id="engage-debate-btn"
            >
              Initiate Debate
            </button>
          </section>
        )}

        {/* Global Error Terminal Output */}
        {error && (
          <div className="bg-red-950/30 border border-red-500/40 p-4 rounded-none flex items-start gap-3.5 animate-fade-in fade-up-enter" id="error-alert">
            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1 font-mono">
              <p className="font-orbitron font-black text-red-400 uppercase tracking-widest">MALFUNCTION REGISTERED:</p>
              <p className="text-[#e0e0ff]/80 font-mono-tech leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Loading Matrix screen */}
        {loading && (
          <section className="bg-[#101030] border-2 border-[#00b4d8] p-8 flex flex-col items-center justify-center text-center space-y-6 shadow-[4px_4px_0px_#00b4d8]" id="neural-loading-station">
            <div className="relative flex items-center justify-center py-2">
              <div className="w-12 h-12 rounded-none border-2 border-[#00f5d4] border-t-transparent animate-spin" style={{ animationDuration: '1s' }} />
              <div className="absolute w-6 h-6 rounded-none border border-dotted border-[#ff6b00] animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-md font-bold font-orbitron text-[#00f5d4] tracking-widest uppercase">CONNECTING SYNAPETIC SOCKETS...</h3>
              <p className="text-xs text-[#00b4d8] font-bold animate-pulse tracking-widest uppercase">{loadingStep}</p>
              <p className="max-w-md mx-auto text-[10px] text-gray-500 leading-normal font-mono-tech pt-2 border-t border-gray-800">
                KAI is aligning positive quantum space. NATALIE is processing analytical objective benchmarks.
              </p>
            </div>
          </section>
        )}

        {/* Mid-core Content Zone (Adjustable Splitting Grid) */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0" id="arena-stage-rows">
          
          {/* Column A: Combatant Bios & Presets Side-Drawer */}
          <div className="w-full lg:w-1/4 flex flex-col gap-4" id="arena-biography-sidebar">
            
            {/* Fighter - KAI CARD */}
            <article className="p-4 border border-[#00f5d4] bg-[#00f5d411] relative overflow-hidden flex flex-col justify-between min-h-[140px] pulse-cyan-glow transition-all" id="fighter-card-max">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#00f5d4]"></div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h2 className="text-[#00f5d4] font-black italic text-xl uppercase tracking-tighter font-orbitron">KAI</h2>
                  <span className="text-[8px] border border-[#00f5d4]/40 text-[#00f5d4] px-1 font-bold">CORE_01</span>
                </div>
                <p className="text-[10px] uppercase font-bold text-[#00b4d8] leading-none">Positive Focus Metaphors</p>
                <p className="text-[11px] leading-relaxed text-[#e0e0ff]/80 font-mono-tech">
                  Borderline delusional with absolute assurance in his experiences, manifesting success through vivid analogies.
                </p>
              </div>
              <div className="text-[9px] text-[#00f5d4]/50 font-bold border-t border-[#00f5d4]/20 pt-1.5 mt-2 flex justify-between">
                <span>VOICE: KAI-AMER-METAPHOR</span>
                <span>CONF: 100%</span>
              </div>
            </article>

            {/* Fighter - NATALIE CARD */}
            <article className="p-4 border border-[#ff6b00] bg-[#ff6b0011] relative overflow-hidden flex flex-col justify-between min-h-[140px] pulse-orange-glow transition-all" id="fighter-card-vera">
              <div className="absolute top-0 right-0 w-1 h-full bg-[#ff6b00]"></div>
              <div className="space-y-2">
                <div className="flex justify-between items-center flex-row-reverse">
                  <h2 className="text-[#ff6b00] font-black italic text-xl uppercase tracking-tighter font-orbitron">NATALIE</h2>
                  <span className="text-[8px] border border-[#ff6b00]/40 text-[#ff6b00] px-1 font-bold">CORE_02</span>
                </div>
                <p className="text-[10px] uppercase font-bold text-amber-300 leading-none text-right">Assertive, Calm, Observative</p>
                <p className="text-[11px] leading-relaxed text-[#e0e0ff]/80 font-mono-tech text-right">
                  Unshakeable calm demeanor. Systematically deconstructs arguments focusing entirely on empirical facts over feelings.
                </p>
              </div>
              <div className="text-[9px] text-[#ff6b00]/50 font-bold border-t border-[#ff6b00]/20 pt-1.5 mt-2 flex justify-between flex-row-reverse">
                <span>VOICE: NATALIE-FACTS</span>
                <span>LOGIC: 100%</span>
              </div>
            </article>

            {/* Examples Chip Station */}
            {!debate && !loading && (
              <div className="mt-2 bg-[#0b0b20]/60 p-4 border border-[#00b4d8]/20" id="preset-examples-panel">
                <h3 className="text-[10px] uppercase text-[#00b4d8] mb-2 font-black tracking-widest font-orbitron">Example Matrices</h3>
                <div className="flex flex-wrap gap-2" id="topic-chips">
                  {examples.map((exName) => (
                    <button 
                      key={exName}
                      onClick={() => setTopic(exName)}
                      className={`text-[9px] px-2 py-1.5 border hover:border-[#00f5d4] transition-all cursor-pointer font-bold uppercase ${
                        topic === exName 
                          ? 'border-[#00f5d4] bg-[#00f5d4]/10 text-cyan-300' 
                          : 'border-[#333] bg-[#1a1a2e] text-gray-400'
                      }`}
                      id={`chip-${exName.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {exName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Column B: Active Live Debate Arena Flow stream */}
          <div className="flex-1 flex flex-col min-h-0" id="arena-live-flow-content">
            {debate ? (
              <div className="flex flex-col space-y-4" id="active-inner-board">
                
                {/* Status indicator console */}
                <div className="bg-[#101030] border-l-4 border-[#00b4d8] p-3 flex items-center justify-between" id="arena-status-bar">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#00f5d4] animate-pulse font-bold tracking-widest">● LIVE STREAM ENGAGED</span>
                    <span className="text-[#333]">/</span>
                    <span className="text-white font-orbitron truncate font-extrabold max-w-[140px] sm:max-w-xs">{debate.topic.toUpperCase()}</span>
                  </div>
                  
                  <button 
                    onClick={resetArena}
                    className="text-[10px] bg-red-950/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white px-2.5 py-1 font-bold tracking-wider transition-all"
                    id="abort-debate-btn"
                  >
                    ABORT PROTOCOL
                  </button>
                </div>

                {/* Sub sides highlights */}
                <div className="grid grid-cols-2 gap-2 text-center" id="sides-header">
                  <div className="bg-[#00f5d411] border border-[#00f5d4]/20 p-2">
                    <span className="text-[9px] text-[#555] block font-bold uppercase tracking-wider">KAI FIGHTS FOR:</span>
                    <span className="text-xs sm:text-sm font-black font-orbitron text-[#00f5d4] uppercase tracking-tighter">{debate.sideA}</span>
                  </div>
                  <div className="bg-[#ff6b0011] border border-[#ff6b00]/20 p-2">
                    <span className="text-[9px] text-[#555] block font-bold uppercase tracking-wider">NATALIE FIGHTS FOR:</span>
                    <span className="text-xs sm:text-sm font-black font-orbitron text-[#ff6b00] uppercase tracking-tighter">{debate.sideB}</span>
                  </div>
                </div>

                {/* Stream rows */}
                <div className="space-y-3 px-1 overflow-y-auto max-h-[500px] py-1" id="rounds-stream">
                  {debate.rounds.map((rd, idx) => {
                    if (idx >= visibleRounds) return null;

                    const isMax = rd.speaker === 'KAI';
                    const isActiveSpeaker = visibleRounds === idx + 1;
                    const roundNbr = Math.floor(idx / 2) + 1;
                    const hasRoundDivider = idx % 2 === 0;

                    return (
                      <div key={idx} className="flex flex-col space-y-2 animate-fade-in" id={`argument-row-${idx}`}>
                        {hasRoundDivider && (
                          <div className="flex items-center justify-center gap-2 py-1">
                            <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#333]"></span>
                            <span className="text-[8px] font-orbitron text-gray-500 font-bold tracking-widest bg-[#0a0a20] px-2 py-0.5 border border-[#333]">
                              ROUND 0{roundNbr} PHASE
                            </span>
                            <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#333]"></span>
                          </div>
                        )}

                        <div className={`flex w-full ${isMax ? 'justify-start slide-left-enter' : 'justify-end slide-right-enter'}`}>
                          <div className={`w-full max-w-[85%] sm:max-w-lg p-3.5 relative ${
                            isMax 
                              ? 'bg-[#00f5d411] border-l-4 border-[#00f5d4] text-left' 
                              : 'bg-[#ff6b0011] border-r-4 border-[#ff6b00] text-right'
                          } ${isActiveSpeaker ? (isMax ? 'ring-1 ring-[#00f5d4]' : 'ring-1 ring-[#ff6b00]') : ''}`}>
                            
                            <div className={`flex justify-between items-center mb-1.5 border-b border-[#333]/40 pb-1 ${isMax ? 'flex-row' : 'flex-row-reverse'}`}>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${isMax ? 'text-[#00f5d4]' : 'text-[#ff6b00]'}`}>
                                {rd.speaker} // {isMax ? 'HYPE_CORE' : 'DRY_WIT'}
                              </span>

                              {isActiveSpeaker && (
                                <div className="flex items-center gap-1 bg-[#050510] border border-[#00b4d8]/30 px-1.5 py-0.5">
                                  <span className="text-[7px] text-amber-400 font-black animate-pulse font-orbitron">VOICE_ACTIVE</span>
                                  {renderEqualizer(isMax ? '#00f5d4' : '#ff6b00')}
                                </div>
                              )}
                            </div>

                            <p className={`text-sm leading-relaxed ${
                              isMax ? 'uppercase font-bold italic text-white' : 'font-light text-[#e0e0ff]'
                            }`}>
                              {rd.argument}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Vote box when finished */}
                {showVote && !userVote && (
                  <section className="bg-[#101030] border-2 border-[#00b4d8] p-5 space-y-4 fade-up-enter shadow-[4px_4px_0px_#00b4d8]" id="vote-section">
                    <div className="text-center space-y-1">
                      <h3 className="text-md sm:text-lg font-black font-orbitron uppercase tracking-widest text-[#ff6b00]">
                        AUDIENCE MANDATED VOTE REDIRECT
                      </h3>
                      <p className="text-[11px] text-[#555] max-w-sm mx-auto leading-normal">
                        Rounds finished. Submit voter signature to define winner node.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                      <button 
                        onClick={() => setUserVote('KAI')}
                        className="flex-1 py-1.5 border-2 border-[#00f5d4] bg-[#00f5d4]/5 hover:bg-[#00f5d4]/20 text-[#00f5d4] font-black text-xs font-orbitron uppercase transition-all shadow-[2px_2px_0px_#00f5d4] cursor-pointer"
                        id="vote-max-btn"
                      >
                        Vote KAI
                      </button>
                      <button 
                        onClick={() => setUserVote('NATALIE')}
                        className="flex-1 py-1.5 border-2 border-[#ff6b00] bg-[#ff6b00]/5 hover:bg-[#ff6b00]/20 text-[#ff6b00] font-black text-xs font-orbitron uppercase transition-all shadow-[2px_2px_0px_#ff6b00] cursor-pointer"
                        id="vote-vera-btn"
                      >
                        Vote NATALIE
                      </button>
                    </div>
                  </section>
                )}

                {/* Post Voting React-speech Display Box */}
                {userVote && (
                  <section className="bg-[#101030] p-5 shadow-[4px_4px_0px_#00b4d8] border-2 space-y-4 font-mono fade-up-enter"
                    style={{ borderColor: userVote === 'KAI' ? '#00f5d4' : '#ff6b00' }}
                    id="victory-hall"
                  >
                    <div className="text-center space-y-1">
                      <span className="text-[9px] text-amber-400 font-extrabold block tracking-wider uppercase">VOTER PAYLOAD COMMITTED // MATCH CLOSED</span>
                      <h2 className="text-3xl font-black font-orbitron tracking-tight leading-none text-white uppercase italic">
                        WINNER: <span style={{ color: userVote === 'KAI' ? '#00f5d4' : '#ff6b00' }}>{userVote}</span>
                      </h2>
                    </div>

                    <div className="max-w-xl mx-auto bg-[#050510] border border-[#333] p-4 relative text-xs">
                      <span className="absolute top-1 right-2 text-[8px] text-gray-700 tracking-wider">SYSTEM_LOG_v2.0</span>
                      
                      {userVote === 'KAI' ? (
                        <div className="space-y-3 text-left font-mono-tech" id="max-victory-speech">
                          <p className="text-[10px] text-cyan-300 font-extrabold uppercase">KAI FEELS THE QUANTUM ALIGNMENT:</p>
                          <p className="text-xs italic leading-relaxed text-[#00f5d4]">
                            "I literally visualized this victory in my mind's eye! The universe has aligned perfectly, flowing straight through my experiential metaphors into absolute physical reality! It is a breathtaking quantum shift!"
                          </p>
                          <p className="text-[9px] text-orange-500/50 text-right pt-2 border-t border-[#333] leading-normal">
                            NATALIE: "A fascinating display of confirmation bias. The empirical data remains unchanged, yet subjective enthusiasm has taken the crowd. I shall record these findings."
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 text-left font-mono-tech" id="vera-victory-speech">
                          <p className="text-[10px] text-orange-400 font-extrabold uppercase mt-1">NATALIE OBSERVES OBJECTIVE REALITY:</p>
                          <p className="text-xs italic leading-relaxed text-[#ff6b00]">
                            "The outcome matches the statistical indicators. Concrete realities, empirical verification, and logic have successfully prevailed over emotional constructs. Factuality is simply indisputable."
                          </p>
                          <p className="text-[9px] text-cyan-400/50 text-right pt-2 border-t border-[#333] leading-normal">
                            KAI: "But the energy! The beautiful cosmic flow! My experiences cannot be restricted by your dry spreadsheets of limits! This is a minor misalignment in the vortex!"
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="text-center pt-1">
                      <button 
                        onClick={resetArena}
                        className="bg-[#ff6b00] hover:bg-[#ff8533] text-white px-6 py-2.5 text-xs tracking-wider uppercase font-black italic shadow-[4px_4px_0px_#00b4d8] active:transform active:translate-y-0.5 active:shadow-[2px_2px_0px_#00b4d8]"
                        id="new-debate-btn"
                      >
                        Initiate New Debate
                      </button>
                    </div>
                  </section>
                )}

              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center border-2 border-dashed border-[#00b4d8]/20 p-8 text-center min-h-[260px]" id="empty-stream-stage">
                <Terminal size={32} className="text-[#00b4d8]/30 mb-3" />
                <h4 className="text-[#00b4d8] font-black uppercase text-sm tracking-widest font-orbitron">No Match Stream Active</h4>
                <p className="text-xs text-[#555] max-w-xs mt-1.5 font-mono-tech">
                  Enter parameters above and click "Initiate Debate" to start streaming neural arguments.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Themed Sleek Interface Footer Area */}
        <footer className="mt-auto border-t border-[#333] pt-4" id="arena-footer">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Status indicators */}
            <div className="text-[11px] uppercase flex items-center gap-1">
              <span className="text-[#555] font-bold">Current Stage:</span>
              <span className="text-[#00f5d4] ml-2 animate-pulse font-bold tracking-widest uppercase">
                {loading ? 'SYSTEM_PROCESSING_RECORDS...' : debate ? 'STAGED_DEBATE_STREAM' : 'SYSTEM_READY_UPLINK'}
              </span>
            </div>

            {/* In-footer actions if debate stream exists instead of standard voting row */}
            {debate && !userVote && (
              <div className="flex gap-4 items-center">
                <p className="text-[10px] text-[#555] uppercase font-bold tracking-wider">Cast vote:</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setUserVote('KAI')}
                    className="px-4 py-1.5 border-2 border-[#00f5d4] text-[#00f5d4] text-[10px] font-black uppercase hover:bg-[#00f5d4] hover:text-[#050510] transition-colors"
                    id="footer-vote-max"
                  >
                    Vote KAI
                  </button>
                  <button 
                    onClick={() => setUserVote('NATALIE')}
                    className="px-4 py-1.5 border-2 border-[#ff6b00] text-[#ff6b00] text-[10px] font-black uppercase hover:bg-[#ff6b00] hover:text-[#050510] transition-colors"
                    id="footer-vote-vera"
                  >
                    Vote NATALIE
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </footer>

      </div>
    </div>
  );
}
