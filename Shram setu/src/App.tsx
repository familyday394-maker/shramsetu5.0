/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { JudgeWalkthroughBar } from './components/JudgeWalkthroughBar';
import { Footer } from './components/Footer';
import { ShiftRecorderModal } from './components/ShiftRecorderModal';
import { DisputeModal } from './components/DisputeModal';
import { WorkerSlipModal } from './components/WorkerSlipModal';

// Pages
import { HomePage } from './pages/HomePage';
import { WorkerDashboardPage } from './pages/WorkerDashboardPage';
import { DigitalPassPage } from './pages/DigitalPassPage';
import { ContractorDashboardPage } from './pages/ContractorDashboardPage';
import { WageDisputesPage } from './pages/WageDisputesPage';
import { SkillsPassportPage } from './pages/SkillsPassportPage';
import { ProjectReportPage } from './pages/ProjectReportPage';
import { AdminVerificationPage } from './pages/AdminVerificationPage';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1A2421]">
      <JudgeWalkthroughBar />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentView === 'home' && <HomePage />}
        {currentView === 'worker' && <WorkerDashboardPage />}
        {currentView === 'pass' && <DigitalPassPage />}
        {currentView === 'contractor' && <ContractorDashboardPage />}
        {currentView === 'disputes' && <WageDisputesPage />}
        {currentView === 'skills' && <SkillsPassportPage />}
        {currentView === 'project' && <ProjectReportPage />}
        {currentView === 'audit' && <AdminVerificationPage />}
      </main>

      <Footer />

      {/* Global Modals */}
      <ShiftRecorderModal />
      <DisputeModal />
      <WorkerSlipModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
