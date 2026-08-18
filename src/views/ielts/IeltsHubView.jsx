import React from 'react';
import {
    DEFAULT_IELTS_PROFILE
} from '../../data/ieltsData';
import { IeltsMethodologyView } from './IeltsMethodologyView';
import { IeltsDrillsView } from './IeltsDrillsView';
import { IeltsWritingLab } from './IeltsWritingLab';
import { IeltsSpeakingLab } from './IeltsSpeakingLab';
import { IeltsExamSimulator } from './IeltsExamSimulator';
import { IeltsLanguageGym } from './IeltsLanguageGym';
import { IeltsAnalyticsView } from './IeltsAnalyticsView';

export const IeltsHubView = ({
    currentSubView = 'ielts_methodology',
    navigate,
    profile = DEFAULT_IELTS_PROFILE,
    drillHistory = [],
    writingSubmissions = [],
    speakingRecordings = [],
    mockResults = [],
    onUpdateProfile,
    onCompleteDrill,
    onSaveEssay,
    onSaveRecording,
    onSaveMockResult,
    showToast
}) => {
    // Map current sub-view from App navigation
    const getActiveZone = (view) => {
        switch (view) {
            case 'ielts_drills': return 'drills';
            case 'ielts_writing_lab': return 'writing_lab';
            case 'ielts_speaking_lab': return 'speaking_lab';
            case 'ielts_simulator': return 'simulator';
            case 'ielts_gym': return 'gym';
            case 'ielts_analytics': return 'analytics';
            case 'ielts_methodology':
            case 'ielts_hub':
            default:
                return 'methodology';
        }
    };

    const activeZone = getActiveZone(currentSubView);

    const handleSelectZone = (zone) => {
        if (!navigate) return;
        navigate(`ielts_${zone}`);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-16">
            {/* Render Subzone Components */}
            {activeZone === 'methodology' && <IeltsMethodologyView onSelectZone={handleSelectZone} />}
            {activeZone === 'drills' && <IeltsDrillsView onCompleteDrill={onCompleteDrill} showToast={showToast} />}
            {activeZone === 'writing_lab' && <IeltsWritingLab onSaveEssay={onSaveEssay} showToast={showToast} />}
            {activeZone === 'speaking_lab' && <IeltsSpeakingLab onSaveRecording={onSaveRecording} showToast={showToast} />}
            {activeZone === 'simulator' && <IeltsExamSimulator onSaveMockResult={onSaveMockResult} showToast={showToast} />}
            {activeZone === 'gym' && <IeltsLanguageGym showToast={showToast} />}
            {activeZone === 'analytics' && (
                <IeltsAnalyticsView
                    profile={profile}
                    drillHistory={drillHistory}
                    writingSubmissions={writingSubmissions}
                    speakingRecordings={speakingRecordings}
                    mockResults={mockResults}
                    onUpdateProfile={onUpdateProfile}
                    showToast={showToast}
                />
            )}
        </div>
    );
};
