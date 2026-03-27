"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CHARACTERS } from "@/lib/data";
import type { Character } from "@/lib/types";

function TypingIndicator({ char }: { char: Character }) {
  return (
    <div className="flex items-end gap-2">
      <Avatar src={char.avatar} name={char.name} color={char.color} size="sm" />
      <div className="flex items-center gap-1 bg-white/6 rounded-2xl rounded-bl-sm px-4 py-3">
        {[0,1,2].map(i => (
          <span key={i} className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}

export function ChatPanel() {
  const { messages, sendMessage, setActiveCharacter, activeCharacter, chatInput, setChatInput, characters } = useAppStore();
  const [selectedChar, setSelectedChar] = useState<Character>(characters[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const chatMsgs = messages.filter(m =>
    m.channel === 'chat' && (
      (m.from === selectedChar.id && m.to === 'user') ||
      (m.from === 'user' && m.to === selectedChar.id)
    )
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMsgs.length, isTyping]);

  const handleSend = useCallback(() => {
    if (!chatInput.trim()) return;
    setActiveCharacter(selectedChar);
    setIsTyping(true);
    sendMessage(chatInput, 'chat');
    setChatInput('');
    setTimeout(() => setIsTyping(false), 2000 + Math.random() * 2000);
  }, [chatInput, selectedChar, setActiveCharacter, sendMessage, setChatInput]);

  // Voice input via SpeechRecognition
  useEffect(() => {
    if (!voiceMode) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results as SpeechRecognitionResultList)
        .map((r: SpeechRecognitionResult) => r[0].transcript)
        .join('');
      setChatInput(transcript);
      if (e.results[e.results.length - 1].isFinal && transcript.trim()) {
        setTimeout(() => handleSend(), 300);
      }
    };
    recognitionRef.current = recognition;
    recognition.start();
    return () => recognition.stop();
  }, [voiceMode, selectedChar, handleSend, setChatInput]);

  return (
    <div className="flex h-full">
      {/* Character list */}
      <div className="w-44 border-r border-white/5 flex flex-col">
        <div className="px-3 py-2 border-b border-white/5">
          <span className="text-xs font-medium text-white/60">Team Chat</span>
        </div>
        {characters.map(char => {
          const unread = messages.filter(m => m.channel === 'chat' && m.from === char.id && !m.read).length;
          return (
            <button
              key={char.id}
              onClick={() => setSelectedChar(char)}
              className={`flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/4 transition-colors ${selectedChar.id === char.id ? 'bg-white/6' : ''}`}
            >
              <div className="relative">
                <Avatar src={char.avatar} name={char.name} color={char.color} size="sm" />
                <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#161616] ${char.online ? 'bg-green-400' : 'bg-white/20'}`} />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-xs text-white/70 truncate">{char.name.split(' ')[0]}</div>
                <div className="text-[10px] text-white/30 truncate">
                  {{neutral:'Neutral',frustrated:'Frustrated',cooperative:'Collaborative',disengaged:'Away',alarmed:'Alarmed!'}[char.emotion]}
                </div>
              </div>
              {unread > 0 && <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center shrink-0">{unread}</span>}
            </button>
          );
        })}
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
          <Avatar src={selectedChar.avatar} name={selectedChar.name} color={selectedChar.color} size="sm" />
          <div>
            <div className="text-sm font-medium text-white">{selectedChar.name}</div>
            <div className="text-xs text-white/40">{selectedChar.title}</div>
          </div>
          <div className="ml-auto text-xs text-white/30 italic max-w-48 text-right leading-tight">
            "{selectedChar.visibleAgenda}"
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMsgs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <Avatar src={selectedChar.avatar} name={selectedChar.name} color={selectedChar.color} size="lg" />
              <p className="text-sm text-white/30">Start a conversation with {selectedChar.name.split(' ')[0]}</p>
              <p className="text-xs text-white/20 max-w-48">{selectedChar.visibleAgenda}</p>
            </div>
          )}
          {chatMsgs.map(msg => {
            const isUser = msg.from === 'user';
            const char = !isUser ? characters.find(c => c.id === msg.from) : null;
            const isSecret = msg.id.startsWith('secret-');
            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
                {!isUser && char && <Avatar src={char.avatar} name={char.name} color={char.color} size="sm" />}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '75%' }}>
                  {isSecret && (
                    <div style={{ fontSize: 9, color: '#f5c518', letterSpacing: 1.5, fontWeight: 700, paddingLeft: 4 }}>
                      ✦ INTEL UNLOCKED
                    </div>
                  )}
                  <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    isUser ? 'bg-white text-black rounded-br-sm' : 'bg-white/8 text-white/85 rounded-bl-sm'
                  }`} style={isSecret ? { border: '1px solid rgba(245,197,24,0.35)', background: 'rgba(245,197,24,0.06)' } : {}}>
                    {msg.body}
                  </div>
                </div>
              </div>
            );
          })}
          {isTyping && <TypingIndicator char={selectedChar} />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-white/5">
          <div className="flex items-end gap-2">
            <textarea
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 resize-none focus:outline-none focus:border-white/20 max-h-24 min-h-10"
              placeholder={voiceMode && isListening ? '🎙 Listening...' : `Message ${selectedChar.name.split(' ')[0]}...`}
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              rows={1}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
            />
            {/* Voice toggle */}
            <button
              onClick={() => setVoiceMode(!voiceMode)}
              title={voiceMode ? 'Disable voice mode' : 'Enable voice mode'}
              style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: voiceMode ? (isListening ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.2)') : 'rgba(255,255,255,0.06)',
                border: `1px solid ${voiceMode ? (isListening ? '#ef4444' : '#22c55e') : 'rgba(255,255,255,0.1)'}`,
                color: voiceMode ? (isListening ? '#ef4444' : '#22c55e') : 'rgba(255,255,255,0.35)',
                fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {isListening ? '⏹' : '🎙'}
            </button>
            <Button size="sm" onClick={handleSend} disabled={!chatInput.trim()}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
