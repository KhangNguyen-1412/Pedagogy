import React, { useState, useEffect, useRef } from 'react';
import {
    Mic,
    MicOff,
    Play,
    Pause,
    RotateCcw,
    Clock,
    Volume2,
    CheckCircle2,
    Sparkles,
    BookOpen,
    HelpCircle,
    ChevronDown,
    Save,
    Trash2,
    Square,
    Radio
} from 'lucide-react';
import { IELTS_SPEAKING_TOPICS } from '../../data/ieltsData';

export const IeltsSpeakingLab = ({ onSaveRecording, showToast }) => {
    const [selectedTopicId, setSelectedTopicId] = useState(IELTS_SPEAKING_TOPICS[0]?.id);
    const [prepTimer, setPrepTimer] = useState(IELTS_SPEAKING_TOPICS[0]?.prepTimeSeconds ?? 0);
    const [isPrepRunning, setIsPrepRunning] = useState(false);
    const [speakingTimer, setSpeakingTimer] = useState(IELTS_SPEAKING_TOPICS[0]?.talkTimeSeconds ?? 60);
    const [isSpeakingTimerRunning, setIsSpeakingTimerRunning] = useState(false);

    // Audio recording state (Native Web Audio MediaRecorder)
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlobUrl, setAudioBlobUrl] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const activeTopic = IELTS_SPEAKING_TOPICS.find(t => t.id === selectedTopicId) || IELTS_SPEAKING_TOPICS[0];

    // Preparation timer effect
    useEffect(() => {
        let interval = null;
        if (isPrepRunning && prepTimer > 0) {
            interval = setInterval(() => setPrepTimer(t => t - 1), 1000);
        } else if (prepTimer === 0 && isPrepRunning) {
            setIsPrepRunning(false);
            if (showToast) showToast('Hết thời gian chuẩn bị! Bắt đầu bấm ghi âm để nói.', 'info');
        }
        return () => clearInterval(interval);
    }, [isPrepRunning, prepTimer]);

    // Speaking timer effect
    useEffect(() => {
        let interval = null;
        if (isSpeakingTimerRunning && speakingTimer > 0) {
            interval = setInterval(() => setSpeakingTimer(t => t - 1), 1000);
        } else if (speakingTimer === 0 && isSpeakingTimerRunning) {
            setIsSpeakingTimerRunning(false);
            if (isRecording) stopRecording();
            if (showToast) showToast('Hết thời gian nói cho phần này!', 'info');
        }
        return () => clearInterval(interval);
    }, [isSpeakingTimerRunning, speakingTimer]);

    // Start Audio Recording using navigator.mediaDevices
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                setAudioBlobUrl(url);
                if (showToast) showToast('Đã thu âm xong! Bạn có thể nghe lại bên dưới.', 'success');
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setIsSpeakingTimerRunning(true);
            if (showToast) showToast('Đang thu âm microphone...', 'info');
        } catch (err) {
            console.error('Microphone access error:', err);
            if (showToast) showToast('Không thể truy cập Microphone! Vui lòng cấp quyền ghi âm trên trình duyệt.', 'error');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsSpeakingTimerRunning(false);
        }
    };

    const handleSelectTopic = (topicId) => {
        const top = IELTS_SPEAKING_TOPICS.find(t => t.id === topicId);
        setSelectedTopicId(topicId);
        setPrepTimer(top?.prepTimeSeconds ?? 0);
        setSpeakingTimer(top?.talkTimeSeconds ?? 60);
        setIsPrepRunning(false);
        setIsSpeakingTimerRunning(false);
        setAudioBlobUrl(null);
        if (isRecording) stopRecording();
    };

    const formatTimer = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleSaveRecord = () => {
        if (!audioBlobUrl) {
            if (showToast) showToast('Chưa có bản ghi âm để lưu!', 'error');
            return;
        }

        const record = {
            id: 'spk_' + Date.now(),
            topicId: activeTopic.id,
            part: activeTopic.part,
            topicTitle: activeTopic.topic,
            audioUrl: audioBlobUrl,
            durationSeconds: activeTopic.talkTimeSeconds - speakingTimer,
            date: new Date().toISOString()
        };

        if (onSaveRecording) {
            onSaveRecording(record);
        }
        if (showToast) {
            showToast('Đã lưu bài nói vào Nhật Ký Luyện Thi IELTS!', 'success');
        }
    };

    const vocabList = activeTopic.usefulVocab || activeTopic.vocabBoosters || [];

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
            {/* Header Banner - Identical layout to ProgramsView (Sticky Header) */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean font-bold">Phòng Speaking Lab</h2>
                    <p className="text-lg text-gray-600 mt-2 font-body">Trạm thu âm trực tiếp trên trình duyệt, Cue Card Part 2 và sơ đồ tư duy 5W1H.</p>
                </div>
                <div className="flex items-center gap-3">
                    {isRecording ? (
                        <button
                            type="button"
                            onClick={stopRecording}
                            className="flex items-center gap-2 px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-serif-title font-bold text-xs shadow-editorial animate-pulse"
                        >
                            <Square size={14} /> Dừng Thu Âm ({formatTimer(speakingTimer)})
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={startRecording}
                            className="flex items-center gap-2 px-5 py-2 bg-brand-jasper hover:bg-red-800 text-white font-serif-title font-bold text-xs shadow-editorial"
                        >
                            <Mic size={15} /> Bắt Đầu Thu Âm
                        </button>
                    )}
                </div>
            </div>

            {/* Speaking Part Selector Bar - Editorial Style */}
            <div className="border-editorial p-4 bg-white shadow-editorial flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-serif-title uppercase font-bold text-gray-500 mr-2">Chọn Chủ Đề:</span>
                    {IELTS_SPEAKING_TOPICS.map(topic => (
                        <button
                            key={topic.id}
                            type="button"
                            onClick={() => handleSelectTopic(topic.id)}
                            className={`px-3 py-1.5 text-xs font-serif-title font-bold transition-all border ${
                                selectedTopicId === topic.id
                                    ? 'bg-brand-jasper text-white border-brand-jasper shadow-xs'
                                    : 'bg-brand-cream text-brand-cerulean border-brand-cerulean/30 hover:bg-brand-cerulean/10'
                            }`}
                        >
                            {topic.part} • {topic.topic}
                        </button>
                    ))}
                </div>
            </div>

            {/* MAIN SPEAKING LAB WORKSPACE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Screen: Cue Card & Questions (5 Cols) */}
                <div className="lg:col-span-5 space-y-4">
                    {/* Prompt Box */}
                    <div className="border-editorial bg-white p-6 shadow-editorial space-y-4">
                        <div className="flex items-center justify-between border-b border-brand-cerulean/15 pb-2">
                            <span className="text-xs font-serif-title uppercase font-bold px-2.5 py-0.5 border bg-red-50 text-brand-jasper border-red-200">
                                {activeTopic.part}
                            </span>
                            <span className="text-xs font-newsreader text-gray-500">
                                Thời gian nói: {activeTopic.talkTimeSeconds}s
                            </span>
                        </div>

                        <h3 className="font-serif-title font-bold text-brand-cerulean text-lg">
                            {activeTopic.topic}
                        </h3>

                        {/* Cue Prompt / Cue Card if Part 2 */}
                        {activeTopic.cuePrompt && (
                            <div className="p-4 bg-brand-cream/50 border border-brand-cerulean/20 space-y-2 text-xs font-newsreader">
                                <div className="text-gray-800 whitespace-pre-line leading-relaxed">
                                    {activeTopic.cuePrompt}
                                </div>
                            </div>
                        )}

                        {activeTopic.cueCard && (
                            <div className="p-4 bg-brand-cream/50 border border-brand-cerulean/20 space-y-2 text-xs font-newsreader">
                                <span className="font-serif-title font-bold text-brand-cerulean uppercase block">
                                    You should say:
                                </span>
                                <ul className="space-y-1 text-gray-800 list-disc pl-4">
                                    {activeTopic.cueCard.map((bullet, i) => (
                                        <li key={i}>{typeof bullet === 'object' ? bullet.text || bullet.title || JSON.stringify(bullet) : bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Mindmap Suggestions if Part 2 */}
                        {activeTopic.mindmapSuggestions && (
                            <div className="p-3.5 bg-white border border-brand-cerulean/15 space-y-2 text-xs font-newsreader">
                                <span className="text-brand-cerulean font-serif-title font-bold uppercase block text-[11px]">
                                    Gợi Ý Triển Khai Ý Tưởng (Mindmap Suggestions):
                                </span>
                                <div className="space-y-1.5 text-xs text-gray-800">
                                    {Object.entries(activeTopic.mindmapSuggestions).map(([k, v]) => (
                                        <div key={k} className="p-2 bg-brand-cream/30 border border-brand-cerulean/10">
                                            <strong className="text-brand-jasper capitalize">{k}: </strong>
                                            <span>{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Questions if Part 1 or 3 */}
                        {activeTopic.questions && activeTopic.questions.length > 0 && (
                            <div className="space-y-2 pt-1">
                                <span className="text-xs font-serif-title font-bold uppercase text-gray-500 block">
                                    Examiner Questions:
                                </span>
                                <div className="space-y-2">
                                    {activeTopic.questions.map((qItem, idx) => {
                                        const qText = typeof qItem === 'object' ? (qItem.q || qItem.question || qItem.text || '') : qItem;
                                        const qTip = typeof qItem === 'object' ? qItem.tip : null;
                                        return (
                                            <div key={idx} className="p-3 bg-brand-cream/40 border border-brand-cerulean/15 text-xs font-newsreader text-gray-800 space-y-1">
                                                <div className="flex items-start gap-2">
                                                    <span className="font-mono font-bold text-brand-jasper shrink-0">Q{idx + 1}:</span>
                                                    <span className="font-bold">{qText}</span>
                                                </div>
                                                {qTip && (
                                                    <div className="pl-6 text-[11px] text-gray-600 italic">
                                                        💡 {qTip}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Preparation Timer if Part 2 */}
                        {activeTopic.prepTimeSeconds > 0 && (
                            <div className="pt-2 border-t border-brand-cerulean/15 flex items-center justify-between">
                                <div className="text-xs font-newsreader text-gray-600">
                                    Thời gian chuẩn bị ghi chú (1 phút):
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-brand-cerulean text-sm">
                                        {formatTimer(prepTimer)}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setIsPrepRunning(!isPrepRunning)}
                                        className="px-2 py-1 bg-brand-cerulean text-white text-[11px] font-serif-title font-bold"
                                    >
                                        {isPrepRunning ? 'Dừng' : 'Bắt đầu 1p'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 5W1H Reflex Mindmap Helper */}
                    <div className="border border-brand-cerulean/25 bg-brand-cream/30 p-5 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-serif-title font-bold text-brand-cerulean uppercase">
                            <BookOpen size={16} className="text-brand-jasper" />
                            Sơ Đồ Phản Xạ 5W1H (Mở Rộng Ý Tự Nhiên):
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs font-newsreader">
                            <div className="p-2 bg-white border border-brand-cerulean/15">
                                <strong className="text-brand-jasper font-mono">Who & When:</strong>
                                <span className="text-gray-600 block text-[11px]">Ai làm cùng, vào thời điểm nào?</span>
                            </div>
                            <div className="p-2 bg-white border border-brand-cerulean/15">
                                <strong className="text-brand-jasper font-mono">Where & What:</strong>
                                <span className="text-gray-600 block text-[11px]">Ở đâu, diễn biến chi tiết ra sao?</span>
                            </div>
                            <div className="p-2 bg-white border border-brand-cerulean/15">
                                <strong className="text-brand-jasper font-mono">Why:</strong>
                                <span className="text-gray-600 block text-[11px]">Tại sao quan trọng, lý do lựa chọn?</span>
                            </div>
                            <div className="p-2 bg-white border border-brand-cerulean/15">
                                <strong className="text-brand-jasper font-mono">How (Feelings):</strong>
                                <span className="text-gray-600 block text-[11px]">Cảm xúc, bài học rút ra là gì?</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Screen: Audio Recording & Model Sample (7 Cols) */}
                <div className="lg:col-span-7 border-editorial bg-white p-6 md:p-8 shadow-editorial space-y-5">
                    <div className="border-b border-brand-cerulean/20 pb-3 flex items-center justify-between">
                        <h4 className="font-serif-title font-bold text-brand-cerulean text-lg">
                            Bản Ghi Âm & Đối Chiếu Giám Khảo
                        </h4>
                        <span className="text-xs font-mono text-gray-500">
                            Hỗ trợ micro trình duyệt
                        </span>
                    </div>

                    {/* Audio Player of User's Recording */}
                    {audioBlobUrl ? (
                        <div className="p-4 bg-emerald-50/50 border border-emerald-300 space-y-3 animate-fade-in">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-serif-title font-bold text-emerald-900 flex items-center gap-1.5">
                                    <CheckCircle2 size={16} /> Đã Ghi Âm Thành Công!
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setAudioBlobUrl(null)}
                                    className="text-xs font-serif-title text-red-700 hover:underline flex items-center gap-1"
                                >
                                    <Trash2 size={13} /> Thu âm lại
                                </button>
                            </div>
                            <audio src={audioBlobUrl} controls className="w-full" />
                            <div className="flex justify-end pt-1">
                                <button
                                    type="button"
                                    onClick={handleSaveRecord}
                                    className="flex items-center gap-2 px-5 py-2 bg-brand-jasper text-white text-xs font-serif-title font-bold hover:bg-red-800 shadow-editorial"
                                >
                                    <Save size={15} /> Lưu Bài Nói Vào Nhật Ký
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center border-2 border-dashed border-brand-cerulean/25 bg-brand-cream/20 space-y-2">
                            <Mic size={32} className="mx-auto text-brand-cerulean/40" />
                            <p className="text-xs font-newsreader text-gray-600">
                                Nhấp vào nút <strong>"Bắt Đầu Thu Âm"</strong> ở thanh tiêu đề trên để bắt đầu bài nói của bạn.
                            </p>
                        </div>
                    )}

                    {/* Band 8.0+ Model Answer */}
                    {activeTopic.sampleBand8 && (
                        <div className="pt-3 border-t border-brand-cerulean/15 space-y-3">
                            <div className="flex items-center gap-2 text-sm font-serif-title font-bold text-brand-jasper">
                                <Sparkles size={16} /> Bài Trả Lời Mẫu Chuẩn Band 8.0+ (Cambridge Model Response)
                            </div>
                            <div className="p-4 bg-brand-cream/40 border border-brand-cerulean/20 text-xs font-newsreader text-gray-800 whitespace-pre-line leading-relaxed">
                                {activeTopic.sampleBand8}
                            </div>
                        </div>
                    )}

                    {/* High-Band Vocabulary Boosters */}
                    {vocabList && vocabList.length > 0 && (
                        <div className="pt-2 space-y-2">
                            <span className="text-xs font-serif-title uppercase font-bold text-brand-cerulean block">
                                Cụm Từ Nâng Band Đắt Giá (Lexical Resource):
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {vocabList.map((voc, i) => {
                                    const wordStr = typeof voc === 'object' ? voc.word : voc;
                                    const meaningStr = typeof voc === 'object' ? voc.meaning : null;
                                    return (
                                        <div key={i} className="px-2.5 py-1 bg-white border border-brand-cerulean/20 text-xs font-mono text-brand-jasper font-bold inline-flex items-center gap-1.5">
                                            <span>★ {wordStr}</span>
                                            {meaningStr && <span className="text-[11px] font-newsreader text-gray-500 font-normal">({meaningStr})</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
