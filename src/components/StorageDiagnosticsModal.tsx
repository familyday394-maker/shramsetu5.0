import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Database,
  CloudOff,
  Server,
  Layers,
  CheckCircle,
  Clock,
  RotateCcw,
  X,
  FileCode,
  ShieldCheck,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

export const StorageDiagnosticsModal: React.FC = () => {
  const {
    isStorageModalOpen,
    setStorageModalOpen,
    storageStatus,
    refreshStorageStatus,
    records,
    workers,
    disputes,
    approvalRequests,
    resetDemoData,
    language,
    setApprovalsModalOpen,
  } = useApp();

  useEffect(() => {
    if (isStorageModalOpen) {
      refreshStorageStatus();
    }
  }, [isStorageModalOpen, refreshStorageStatus]);

  if (!isStorageModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#E3E0D8]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="storage-modal-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#FAF9F5] border-b border-[#E3E0D8] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#1B4332] text-white flex items-center justify-center shadow-sm">
              <Database className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 id="storage-modal-title" className="text-lg font-bold text-[#123524]">
                {language === 'hi' ? 'स्टोरेज आर्किटेक्चर एवं डायग्नोस्टिक्स' : 'Storage Engine & Diagnostics'}
              </h2>
              <p className="text-xs text-[#52796F]">
                {language === 'hi'
                  ? 'स्थानीय डेमो मोड (IndexedDB) एवं आगामी Supabase क्लाउड माइग्रेशन'
                  : 'Local Demo Mode (IndexedDB) & Upcoming Supabase Cloud Migration'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setStorageModalOpen(false)}
            className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Prominent Architectural State Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-amber-900 text-sm">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>Timing Constraint & Deployment Status</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-200 text-amber-900">
                Scheduled Next Week
              </span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Supabase cloud backend will be connected next week. For now, Shram Setu 2.0 operates in full{' '}
              <strong>Local Demo Mode</strong> powered by browser <strong>IndexedDB</strong>. All repository interfaces,
              Supabase client adapters, PostgreSQL SQL migrations, and seed files are fully prepared and tested.
            </p>
          </div>

          {/* Active Storage Engine Card */}
          <div className="border border-emerald-200 bg-emerald-50/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></div>
                <h3 className="text-sm font-bold text-emerald-950">
                  Active Storage: Browser IndexedDB (`shram_setu_v2_db`)
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Local Demo Active
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="bg-white p-2.5 rounded border border-emerald-100 text-center">
                <div className="text-xs text-gray-500 font-medium">Ledger Blocks</div>
                <div className="text-lg font-bold text-emerald-900 font-mono">{records.length}</div>
              </div>
              <div className="bg-white p-2.5 rounded border border-emerald-100 text-center">
                <div className="text-xs text-gray-500 font-medium">Artisans</div>
                <div className="text-lg font-bold text-emerald-900 font-mono">{workers.length}</div>
              </div>
              <div className="bg-white p-2.5 rounded border border-emerald-100 text-center">
                <div className="text-xs text-gray-500 font-medium">Disputes</div>
                <div className="text-lg font-bold text-emerald-900 font-mono">{disputes.length}</div>
              </div>
              <div className="bg-white p-2.5 rounded border border-emerald-100 text-center">
                <div className="text-xs text-gray-500 font-medium">Simulated Approvals</div>
                <div className="text-lg font-bold text-emerald-900 font-mono">{approvalRequests.length}</div>
              </div>
            </div>
          </div>

          {/* Cross-Device Simulation Disclosure */}
          <div className="border border-blue-200 bg-blue-50/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-blue-950">
                <Smartphone className="w-4 h-4 text-blue-700" />
                <span>Simulated Cross-Device Approval Workflow</span>
              </div>
              <button
                onClick={() => {
                  setStorageModalOpen(false);
                  setApprovalsModalOpen(true);
                }}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
              >
                Open Approvals Panel
              </button>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              Approval requests between contractors and artisans (for attendance, wage disbursements, and rate corrections)
              are clearly labelled <strong>simulations</strong> persisted in IndexedDB. Real-time multi-device push will be activated
              with Supabase subscriptions next week.
            </p>
          </div>

          {/* Architecture Checklist */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Architecture & Migration Deliverables
            </h4>
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg text-xs bg-white">
              <div className="p-3 flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-gray-900">Decoupled Repository Contract:</span>
                  <span className="text-gray-600 font-mono ml-1">src/services/repository/types.ts</span>
                  <p className="text-gray-500 mt-0.5">
                    Defines strict IDataRepository interface separating business logic from storage engines.
                  </p>
                </div>
              </div>

              <div className="p-3 flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-gray-900">PostgreSQL Migration File:</span>
                  <span className="text-gray-600 font-mono ml-1">
                    supabase/migrations/20261024000000_shram_setu_initial_schema.sql
                  </span>
                  <p className="text-gray-500 mt-0.5">
                    Includes 6 relational tables, RLS policies, check constraints, foreign keys, and updated_at triggers.
                  </p>
                </div>
              </div>

              <div className="p-3 flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-gray-900">Authoritative Seed Script:</span>
                  <span className="text-gray-600 font-mono ml-1">supabase/seed.sql</span>
                  <p className="text-gray-500 mt-0.5">
                    Seeds identical demonstration records (Ramesh Verma, Sunita Bai, 8 verified blocks, 2 disputes).
                  </p>
                </div>
              </div>

              <div className="p-3 flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-gray-900">Supabase Adapter & Fallback:</span>
                  <span className="text-gray-600 font-mono ml-1">src/services/repository/supabaseAdapter.ts</span>
                  <p className="text-gray-500 mt-0.5">
                    Typed column mapper with bidirectional fidelity and graceful offline IndexedDB fallback.
                  </p>
                </div>
              </div>

              <div className="p-3 flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-gray-900">Complete Deployment Guide:</span>
                  <span className="text-gray-600 font-mono ml-1">docs/SUPABASE_SETUP.md</span>
                  <p className="text-gray-500 mt-0.5">
                    Step-by-step instructions for linking Supabase project, pushing migrations, and configuring environment keys.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#FAF9F5] border-t border-[#E3E0D8] px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={() => {
              resetDemoData();
              refreshStorageStatus();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Baseline</span>
          </button>

          <button
            onClick={() => setStorageModalOpen(false)}
            className="px-4 py-1.5 text-xs font-bold text-white bg-[#1B4332] hover:bg-[#123524] rounded-md transition-colors"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
