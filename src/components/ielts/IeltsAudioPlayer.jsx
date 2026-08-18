import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, FileText, CheckCircle2 } from 'lucide-react';

export const IeltsAudioPlayer = ({
    audioUrl,
    tapescript,
    highlightPositions = [],
    title = "IELTS Listening Audio Track"
}) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showTapescript, setShowTapescript] = useState(false);
    const [highlightAnswers, setHighlightAnswers] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration || 0);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [audioUrl]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log('Audio play error:', e));
        }
    };

    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const skipTime = (seconds) => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.currentTime + seconds, duration));
    };

    const cyclePlaybackRate = () => {
        const rates = [0.8, 1.0, 1.25, 1.5];
        const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
        setPlaybackRate(nextRate);
        if (audioRef.current) {
            audioRef.current.playbackRate = nextRate;
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '00:00';
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Format tapescript with dynamic highlight replacement
    const renderFormattedTapescript = (text) => {
        if (!text) return null;
        if (!highlightAnswers) {
            return text.replace(/\[([^\]]+)\]/g, '$1');
        }
        const parts = text.split(/(\[[^\]]+\])/g);
        return parts.map((part, index) => {
            if (part.startsWith('[') && part.endsWith(']')) {
                const answer = part.slice(1, -1);
                return (
                    <mark key={index} className="bg-amber-200 text-brand-ink font-bold px-1.5 py-0.5 rounded border border-amber-300 shadow-xs animate-pulse">
                        {answer}
                    </mark>
                );
            }
            return part;
        });
    };

    return (
        <div className="bg-white border border-brand-cerulean/20 rounded-xl p-5 shadow-xs transition-all hover:shadow-md">
            <audio ref={audioRef} src={audioUrl} preload="metadata" />

            {/* Title & Speed Tag */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-jasper animate-ping" />
                    <h4 className="font-serif-title font-bold text-brand-cerulean text-base">{title}</h4>
                </div>
                <button
                    onClick={cyclePlaybackRate}
                    className="px-2.5 py-1 text-xs font-mono font-bold bg-brand-cream border border-brand-cerulean/30 rounded-md text-brand-cerulean hover:bg-brand-cerulean hover:text-white transition-colors"
                    title="Thay đổi tốc độ phát"
                >
                    {playbackRate}x
                </button>
            </div>

            {/* Time progress bar */}
            <div className="space-y-1 mb-4">
                <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-brand-cerulean/15 rounded-lg appearance-none cursor-pointer accent-brand-cerulean"
                />
                <div className="flex justify-between text-xs font-mono text-gray-500">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between gap-2 border-t border-brand-cerulean/10 pt-3">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => skipTime(-10)}
                        className="p-2 text-brand-cerulean hover:bg-brand-cream rounded-full transition-colors"
                        title="Lùi lại 10 giây"
                    >
                        <RotateCcw size={18} />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-cerulean text-white hover:bg-brand-cerulean/90 shadow-md transition-all active:scale-95"
                        title={isPlaying ? "Tạm dừng" : "Phát audio"}
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                    </button>

                    <button
                        onClick={() => skipTime(10)}
                        className="p-2 text-brand-cerulean hover:bg-brand-cream rounded-full transition-colors"
                        title="Tua tới 10 giây"
                    >
                        <RotateCw size={18} />
                    </button>

                    <button
                        onClick={() => {
                            if (audioRef.current) {
                                audioRef.current.muted = !isMuted;
                                setIsMuted(!isMuted);
                            }
                        }}
                        className="p-2 text-gray-500 hover:text-brand-cerulean rounded-full transition-colors"
                    >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                </div>

                {tapescript && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowTapescript(!showTapescript)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-serif-title font-bold rounded-lg border transition-all ${
                                showTapescript
                                    ? 'bg-brand-cerulean text-white border-brand-cerulean'
                                    : 'bg-brand-cream text-brand-cerulean border-brand-cerulean/30 hover:border-brand-cerulean'
                            }`}
                        >
                            <FileText size={14} />
                            {showTapescript ? 'Ẩn Tapescript' : 'Xem Tapescript'}
                        </button>
                    </div>
                )}
            </div>

            {/* Interactive Tapescript Drawer */}
            {showTapescript && tapescript && (
                <div className="mt-4 pt-4 border-t border-dashed border-brand-cerulean/20 animate-fade-in">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-serif-title uppercase tracking-wider text-brand-cerulean font-bold">
                            Audio Script / Tapescript
                        </span>
                        <button
                            onClick={() => setHighlightAnswers(!highlightAnswers)}
                            className={`flex items-center gap-1 text-xs font-sans px-2 py-0.5 rounded border transition-colors ${
                                highlightAnswers
                                    ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                                    : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                            }`}
                        >
                            <CheckCircle2 size={13} />
                            {highlightAnswers ? 'Đang bật Highlight Đáp án' : 'Bật Highlight Đáp án'}
                        </button>
                    </div>
                    <div className="p-3 bg-brand-cream/60 rounded-lg text-sm font-newsreader leading-relaxed text-brand-ink whitespace-pre-line border border-brand-cerulean/10 max-h-56 overflow-y-auto">
                        {renderFormattedTapescript(tapescript)}
                    </div>
                </div>
            )}
        </div>
    );
};
