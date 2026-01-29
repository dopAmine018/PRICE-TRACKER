
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

interface LiveAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  isRtl: boolean;
}

const LiveAssistant: React.FC<LiveAssistantProps> = ({ isOpen, onClose, theme, isRtl }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [transcriptions, setTranscriptions] = useState<{role: 'user'|'bot', text: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcriptions]);

  const decodeBase64 = (base64: string) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
    return buffer;
  };

  const startSession = async () => {
    try {
      setStatus('Connecting...');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputContext = new AudioContext({ sampleRate: 16000 });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: 'You are an expert for the Last War: Survival game. You provide advice on the best store deals and item values. Be helpful, concise, and professional. Always use the latest price data provided by the app.',
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('Listening...');
            const source = inputContext.createMediaStreamSource(stream);
            const scriptProcessor = inputContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputContext.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
              const audioBytes = decodeBase64(msg.serverContent.modelTurn.parts[0].inlineData.data);
              const buffer = await decodeAudioData(audioBytes, audioContextRef.current!);
              const source = audioContextRef.current!.createBufferSource();
              source.buffer = buffer;
              source.connect(audioContextRef.current!.destination);
              const startTime = Math.max(nextStartTimeRef.current, audioContextRef.current!.currentTime);
              source.start(startTime);
              nextStartTimeRef.current = startTime + buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
            if (msg.serverContent?.inputTranscription?.text) {
              setTranscriptions(prev => [...prev, {role: 'user', text: msg.serverContent!.inputTranscription!.text}]);
            }
            if (msg.serverContent?.outputTranscription?.text) {
              setTranscriptions(prev => [...prev, {role: 'bot', text: msg.serverContent!.outputTranscription!.text}]);
            }
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            setIsActive(false);
            setStatus('Session ended');
          },
          onerror: (e) => {
            console.error(e);
            setStatus('Connection error');
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Microphone access denied or error');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
    setStatus('Idle');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <div className={`relative w-full max-w-2xl h-[80vh] flex flex-col rounded-3xl border-2 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 ${
        theme === 'dark' ? 'bg-[#161a22] border-cyan-400' : 'bg-white border-blue-600'
      }`}>
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <h2 className="text-xl font-black uppercase tracking-widest">Live Assistant</h2>
          </div>
          <button onClick={onClose} className="text-2xl hover:opacity-50 transition-opacity">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar" ref={scrollRef}>
          {transcriptions.map((t, i) => (
            <div key={i} className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-bold shadow-sm ${
                t.role === 'user' 
                  ? 'bg-cyan-400 text-black rounded-tr-none' 
                  : theme === 'dark' ? 'bg-[#273044] text-white rounded-tl-none' : 'bg-gray-100 text-gray-900 rounded-tl-none'
              }`}>
                {t.text}
              </div>
            </div>
          ))}
          {transcriptions.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-40 gap-4 text-center">
              <div className="text-6xl">🎙️</div>
              <p className="font-bold text-lg">Talk to me about Last War deals!</p>
            </div>
          )}
        </div>

        <div className="p-8 border-t flex flex-col items-center gap-4 bg-black/20">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{status}</p>
          <button
            onClick={isActive ? stopSession : startSession}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-2xl transition-all transform hover:scale-110 active:scale-95 ${
              isActive ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-cyan-400 text-black shadow-cyan-400/20'
            }`}
          >
            {isActive ? '⏹' : '🎙️'}
          </button>
          {!isActive && <p className="text-xs opacity-50 font-bold">Tap to start voice chat</p>}
        </div>
      </div>
    </div>
  );
};

export default LiveAssistant;
