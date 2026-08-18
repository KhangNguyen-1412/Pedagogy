import React, { useState } from 'react';
import { DEFAULT_MOS_PROFILE } from '../../data/mosIc3Data';
import { MosVirtualSandboxView } from './MosVirtualSandboxView';
import { MosProjectBankView } from './MosProjectBankView';
import { Ic3DigitalLabView } from './Ic3DigitalLabView';
import { MosAnalyticsView } from './MosAnalyticsView';

export const MosIc3HubView = ({
    currentSubView = 'mos_sandbox',
    navigate,
    showToast
}) => {
    const [selectedProjectId, setSelectedProjectId] = useState('proj_excel_01');
    const [mosProfile, setMosProfile] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('pedagogy_mos_profile');
            if (saved) {
                try { return JSON.parse(saved); } catch (e) {}
            }
        }
        return DEFAULT_MOS_PROFILE;
    });

    const handleSelectProject = (projId) => {
        setSelectedProjectId(projId);
        if (navigate) navigate('mos_sandbox');
    };

    const handleCompleteProject = (result) => {
        setMosProfile(prev => {
            const updated = {
                ...prev,
                totalProjectsCompleted: prev.totalProjectsCompleted + 1,
                recentAttempts: [result, ...(prev.recentAttempts || [])]
            };
            if (typeof window !== 'undefined') {
                localStorage.setItem('pedagogy_mos_profile', JSON.stringify(updated));
            }
            return updated;
        });
        if (showToast) showToast(`Hoàn thành dự án với số điểm ${result.score}/1000!`, 'success');
    };

    // Subview routing
    if (currentSubView === 'mos_projects') {
        return (
            <MosProjectBankView
                onSelectProject={handleSelectProject}
                navigate={navigate}
            />
        );
    }

    if (currentSubView === 'ic3_lab') {
        return (
            <Ic3DigitalLabView
                showToast={showToast}
                navigate={navigate}
            />
        );
    }

    if (currentSubView === 'mos_analytics') {
        return (
            <MosAnalyticsView
                profile={mosProfile}
                navigate={navigate}
            />
        );
    }

    // Default to Virtual Sandbox directly
    return (
        <MosVirtualSandboxView
            selectedProjectId={selectedProjectId}
            onCompleteProject={handleCompleteProject}
            navigate={navigate}
            showToast={showToast}
        />
    );
};
