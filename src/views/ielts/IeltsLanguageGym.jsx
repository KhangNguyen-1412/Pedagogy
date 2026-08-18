import React, { useState } from 'react';
import {
    Dumbbell,
    Sparkles,
    RotateCw,
    CheckCircle,
    RotateCcw,
    BookOpen,
    HelpCircle,
    Volume2,
    Check,
    X,
    Bookmark,
    ChevronLeft,
    ChevronRight,
    Award
} from 'lucide-react';
import { IELTS_VOCAB_FLASHCARDS, IELTS_GRAMMAR_QUIZZES } from '../../data/ieltsData';

export const IeltsLanguageGym = ({ onSaveVocab, showToast }) => {
    const [activeTab, setActiveTab] = useState('flashcards'); // 'flashcards' or 'grammar'
    const [cardIndex, setCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [masteredCards, setMasteredCards] = useState({});
    const [selectedTopic, setSelectedTopic] = useState('all');

    // Grammar quiz state
    const [quizAnswers, setQuizAnswers] = useState({});
    const [checkedQuiz, setCheckedQuiz] = useState({});

    // Filter flashcards by topic
    const filteredFlashcards = IELTS_VOCAB_FLASHCARDS.filter(card => {
        if (selectedTopic !== 'all' && !card.topic.toLowerCase().includes(selectedTopic.toLowerCase())) return false;
        return true;
    });

    const currentCard = filteredFlashcards[cardIndex] || filteredFlashcards[0];

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNextCard = () => {
        setIsFlipped(false);
        setCardIndex((cardIndex + 1) % filteredFlashcards.length);
    };

    const handlePrevCard = () => {
        setIsFlipped(false);
        setCardIndex((cardIndex - 1 + filteredFlashcards.length) % filteredFlashcards.length);
    };

    const handleMarkMastered = (cardId, isMastered) => {
        setMasteredCards(prev => ({ ...prev, [cardId]: isMastered }));
        if (showToast) {
            showToast(isMastered ? 'Đã đánh dấu thuộc từ vựng này!' : 'Đã chuyển vào danh sách cần ôn tập!', 'info');
        }
        handleNextCard();
    };

    // Text to Speech Pronunciation helper
    const speakWord = (word) => {
        if ('speechSynthesis' in window && word) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-GB'; // British English for IELTS
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSelectGrammarOption = (quizId, optIdx) => {
        setQuizAnswers(prev => ({ ...prev, [quizId]: optIdx }));
    };

    const handleCheckGrammarQuiz = (quizId) => {
        setCheckedQuiz(prev => ({ ...prev, [quizId]: true }));
    };

    const wordText = currentCard?.word || currentCard?.term || '';
    const ipaText = currentCard?.ipa || currentCard?.phonetic || '';
    const meaningText = currentCard?.vietnameseMeaning || currentCard?.definition || '';
    const collocationsText = Array.isArray(currentCard?.collocations) ? currentCard.collocations.join(', ') : (currentCard?.collocations || '');
    const exampleText = currentCard?.exampleSentence || currentCard?.academicExample || '';

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
            {/* Header Banner - Identical layout to ProgramsView (Sticky Header) */}
            <div className="sticky -top-6 md:-top-12 z-30 bg-brand-cream/95 backdrop-blur-md pt-6 md:pt-12 pb-4 -mt-6 md:-mt-12 mb-8 border-b-2 border-brand-cerulean flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-serif-title text-brand-cerulean font-bold">Language Gym (Từ Vựng & Ngữ Pháp)</h2>
                    <p className="text-lg text-gray-600 mt-2 font-body">Flashcards Collocations/Register & Trắc nghiệm Ngữ pháp nâng band 7.5+.</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {[
                        { id: 'flashcards', label: 'Flashcards Collocations', icon: Sparkles },
                        { id: 'grammar', label: 'Grammar Accuracy 7.5+', icon: BookOpen }
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3.5 py-2 text-xs font-serif-title font-bold transition-all border flex items-center gap-1.5 ${
                                    isActive
                                        ? 'bg-brand-jasper text-white border-brand-jasper shadow-editorial'
                                        : 'bg-white text-brand-cerulean border-brand-cerulean/30 hover:bg-brand-cream'
                                }`}
                            >
                                <Icon size={14} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* TAB 1: FLASHCARDS GYM */}
            {activeTab === 'flashcards' && currentCard && (
                <div className="space-y-6 animate-fade-in">
                    {/* Filter & Progress Bar */}
                    <div className="border-editorial p-4 bg-white shadow-editorial flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-serif-title uppercase font-bold text-gray-500">Chủ đề:</span>
                            <select
                                value={selectedTopic}
                                onChange={(e) => {
                                    setSelectedTopic(e.target.value);
                                    setCardIndex(0);
                                    setIsFlipped(false);
                                }}
                                className="px-3 py-1.5 bg-brand-cream border border-brand-cerulean/30 text-xs font-serif-title font-bold text-brand-cerulean"
                            >
                                <option value="all">Tất Cả Chủ Đề ({IELTS_VOCAB_FLASHCARDS.length})</option>
                                <option value="Environment">Môi Trường (Environment)</option>
                                <option value="Society">Xã Hội (Society & Economy)</option>
                                <option value="Education">Giáo Dục (Education)</option>
                                <option value="Technology">Công Nghệ (Technology)</option>
                            </select>
                        </div>

                        <div className="text-xs font-mono font-bold text-brand-cerulean">
                            Thẻ {cardIndex + 1} / {filteredFlashcards.length}
                        </div>
                    </div>

                    {/* Interactive Flashcard View - Editorial Card */}
                    <div className="max-w-2xl mx-auto">
                        <div
                            onClick={handleFlip}
                            className="border-editorial p-8 md:p-12 bg-white shadow-editorial cursor-pointer min-h-[300px] flex flex-col justify-between hover:border-brand-jasper transition-all group"
                        >
                            {/* Front of Flashcard */}
                            {!isFlipped ? (
                                <div className="space-y-4 text-center my-auto">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-cream border border-brand-cerulean/20 text-xs font-serif-title font-bold text-brand-cerulean uppercase">
                                        {currentCard.topic} {currentCard.partOfSpeech && `• (${currentCard.partOfSpeech})`}
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-serif-title font-bold text-brand-cerulean group-hover:text-brand-jasper transition-colors">
                                        {wordText}
                                    </h3>
                                    <div className="flex items-center justify-center gap-2 text-xs font-mono text-gray-500">
                                        <span>{ipaText}</span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                speakWord(wordText);
                                            }}
                                            className="p-1 hover:text-brand-jasper text-brand-cerulean"
                                            title="Phát âm chuẩn UK"
                                        >
                                            <Volume2 size={16} />
                                        </button>
                                    </div>
                                    <p className="text-xs font-newsreader text-gray-400 italic pt-4">
                                        * Nhấp vào thẻ để lật xem định nghĩa, Collocations và ví dụ 8.0+
                                    </p>
                                </div>
                            ) : (
                                /* Back of Flashcard */
                                <div className="space-y-4 text-left my-auto animate-fade-in text-xs font-newsreader">
                                    <div className="flex items-center justify-between border-b border-brand-cerulean/15 pb-2">
                                        <span className="font-serif-title font-bold text-brand-cerulean text-sm">
                                            {wordText}
                                        </span>
                                        {currentCard.register && (
                                            <span className="text-brand-jasper font-mono font-bold">{currentCard.register}</span>
                                        )}
                                    </div>

                                    <p className="text-sm font-sans font-bold text-gray-900">
                                        {meaningText}
                                    </p>

                                    {collocationsText && (
                                        <div className="p-3 bg-brand-cream/50 border border-brand-cerulean/15 space-y-1">
                                            <strong className="text-brand-cerulean font-serif-title block">Cụm Collocation Đi Kèm:</strong>
                                            <span className="text-brand-jasper font-mono font-bold">{collocationsText}</span>
                                        </div>
                                    )}

                                    {exampleText && (
                                        <div className="p-3 bg-blue-50/50 border border-blue-200 italic text-gray-800">
                                            <strong>Ví dụ học thuật:</strong> "{exampleText}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Controls Bottom Bar */}
                        <div className="flex items-center justify-between mt-4">
                            <button
                                type="button"
                                onClick={handlePrevCard}
                                className="px-4 py-2 border border-brand-cerulean/30 bg-white text-xs font-serif-title font-bold text-brand-cerulean hover:bg-brand-cream flex items-center gap-1 shadow-xs"
                            >
                                <ChevronLeft size={16} /> Thẻ trước
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleMarkMastered(currentCard.id, false)}
                                    className="px-3.5 py-2 border border-red-300 bg-red-50 text-red-800 text-xs font-serif-title font-bold hover:bg-red-100 flex items-center gap-1 shadow-xs"
                                >
                                    <X size={14} /> Cần ôn lại
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleMarkMastered(currentCard.id, true)}
                                    className="px-3.5 py-2 border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-serif-title font-bold hover:bg-emerald-100 flex items-center gap-1 shadow-xs"
                                >
                                    <Check size={14} /> Đã thuộc
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleNextCard}
                                className="px-4 py-2 border border-brand-cerulean/30 bg-white text-xs font-serif-title font-bold text-brand-cerulean hover:bg-brand-cream flex items-center gap-1 shadow-xs"
                            >
                                Thẻ tiếp <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: GRAMMAR ACCURACY 7.5+ */}
            {activeTab === 'grammar' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="border-editorial p-6 md:p-8 bg-white shadow-editorial space-y-6">
                        <div className="border-b border-brand-cerulean/20 pb-3">
                            <h3 className="text-2xl font-serif-title font-bold text-brand-cerulean">
                                Trắc Nghiệm Ngữ Pháp Nâng Cao Chuẩn Band 7.5+
                            </h3>
                            <p className="text-xs font-newsreader text-gray-600 mt-1">
                                Tập trung vào các cấu trúc phức tạp: Đảo ngữ (Inversion), Mệnh đề phân từ (Participle Clauses) và Giả định thức.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {IELTS_GRAMMAR_QUIZZES.map((quiz, qIdx) => {
                                const selectedOpt = quizAnswers[quiz.id];
                                const isChecked = checkedQuiz[quiz.id];
                                const isCorrect = selectedOpt === quiz.correctIndex;

                                return (
                                    <div
                                        key={quiz.id}
                                        className="p-5 border border-brand-cerulean/25 bg-brand-cream/20 space-y-4 shadow-xs"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 h-5 bg-brand-cerulean text-white font-mono font-bold text-xs flex items-center justify-center">
                                                    {qIdx + 1}
                                                </span>
                                                <span className="text-[11px] font-mono font-bold text-brand-jasper uppercase">
                                                    {quiz.title || quiz.category || 'Ngữ Pháp Nâng Cao'}
                                                </span>
                                            </div>
                                            <p className="text-sm font-sans font-bold text-gray-900 pt-1 pl-7 leading-relaxed">
                                                {quiz.question}
                                            </p>
                                        </div>

                                        {/* Options */}
                                        <div className="space-y-2 pl-7">
                                            {quiz.options.map((opt, oIdx) => (
                                                <label
                                                    key={oIdx}
                                                    className={`p-3 border text-xs font-sans flex items-center gap-2.5 cursor-pointer transition-all ${
                                                        isChecked
                                                            ? oIdx === quiz.correctIndex
                                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                                                                : selectedOpt === oIdx
                                                                    ? 'border-red-500 bg-red-50 text-red-900 font-bold'
                                                                    : 'border-gray-200 bg-white opacity-60'
                                                            : selectedOpt === oIdx
                                                                ? 'border-brand-cerulean bg-blue-50/70 font-bold'
                                                                : 'border-gray-200 bg-white hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`quiz_${quiz.id}`}
                                                        checked={selectedOpt === oIdx}
                                                        onChange={() => handleSelectGrammarOption(quiz.id, oIdx)}
                                                        disabled={isChecked}
                                                        className="text-brand-cerulean"
                                                    />
                                                    <span>{opt}</span>
                                                </label>
                                            ))}
                                        </div>

                                        {/* Check Button & Explanation */}
                                        <div className="pl-7 pt-1">
                                            {!isChecked ? (
                                                <button
                                                    type="button"
                                                    disabled={selectedOpt === undefined}
                                                    onClick={() => handleCheckGrammarQuiz(quiz.id)}
                                                    className="px-4 py-1.5 bg-brand-cerulean disabled:opacity-40 text-white text-xs font-serif-title font-bold hover:bg-brand-cerulean/90 shadow-xs"
                                                >
                                                    Kiểm tra đáp án
                                                </button>
                                            ) : (
                                                <div className="p-3.5 bg-white border border-brand-cerulean/20 text-xs font-newsreader space-y-1 animate-fade-in">
                                                    <div className="flex items-center gap-1.5 font-bold font-serif-title">
                                                        {isCorrect ? (
                                                            <span className="text-emerald-800">✓ Hoàn toàn chính xác!</span>
                                                        ) : (
                                                            <span className="text-red-700">✗ Chưa chính xác. Đáp án đúng: {quiz.options[quiz.correctIndex]}</span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed italic">
                                                        <strong>Giải thích ngữ pháp:</strong> {quiz.explanation}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
