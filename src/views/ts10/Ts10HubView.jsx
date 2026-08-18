import React from 'react';
import { DEFAULT_TS10_PROFILE } from '../../data/ts10Data';
import { Ts10MathView } from './Ts10MathView';
import { Ts10LiteratureView } from './Ts10LiteratureView';
import { Ts10EnglishView } from './Ts10EnglishView';
import { Ts10ProvincialMatrixView } from './Ts10ProvincialMatrixView';
import { Ts10CorrectionLab } from './Ts10CorrectionLab';
import { Ts10RoadmapAnalyticsView } from './Ts10RoadmapAnalyticsView';

export const Ts10HubView = ({
    currentSubView = 'ts10_math',
    navigate,
    profile = DEFAULT_TS10_PROFILE,
    submissions = [],
    onSaveSubmission,
    showToast
}) => {
    // Determine which sub-view to render
    const renderSubView = () => {
        switch (currentSubView) {
            case 'ts10_literature':
                return <Ts10LiteratureView />;
            case 'ts10_english':
                return <Ts10EnglishView />;
            case 'ts10_matrix':
                return <Ts10ProvincialMatrixView />;
            case 'ts10_correction':
                return (
                    <Ts10CorrectionLab
                        submissions={submissions}
                        onSaveSubmission={onSaveSubmission}
                        showToast={showToast}
                    />
                );
            case 'ts10_roadmap':
                return <Ts10RoadmapAnalyticsView profile={profile} />;
            case 'ts10_math':
            default:
                return <Ts10MathView />;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-16">
            {renderSubView()}
        </div>
    );
};
