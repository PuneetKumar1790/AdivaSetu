import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { GovTricolorBar } from '../components/gov/GovTricolorBar';
import { GovHeader } from '../components/gov/GovHeader';
import { GovFooter } from '../components/gov/GovFooter';
import { DemoVideoRecorderModal } from '../components/recorder/DemoVideoRecorderModal';
import { DemoScenarioControls } from '../components/demo/DemoScenarioControls';

export const PublicLayout: React.FC = () => {
  const [isRecorderOpen, setIsRecorderOpen] = useState(false);
  const [isDemoControlsOpen, setIsDemoControlsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <GovTricolorBar />
      <GovHeader
        onOpenRecorder={() => setIsRecorderOpen(true)}
        onOpenDemoControls={() => setIsDemoControlsOpen(true)}
      />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <GovFooter />

      {/* Global Modals */}
      <DemoVideoRecorderModal isOpen={isRecorderOpen} onClose={() => setIsRecorderOpen(false)} />
      <DemoScenarioControls isOpen={isDemoControlsOpen} onClose={() => setIsDemoControlsOpen(false)} />
    </div>
  );
};
