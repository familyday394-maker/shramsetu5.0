import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ApprovalRequest, ApprovalRequestType, ApprovalRequestStatus } from '../types';
import {
  Smartphone,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Plus,
  Send,
  X,
  UserCheck,
  Building,
  FileCheck,
  CreditCard,
  Scale,
} from 'lucide-react';

export const SimulatedApprovalsModal: React.FC = () => {
  const {
    isApprovalsModalOpen,
    setApprovalsModalOpen,
    approvalRequests,
    addApprovalRequest,
    respondToApprovalRequest,
    workers,
    worker,
    activeDemoRole,
    language,
    contractor,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'resolved'>('all');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [responseNotes, setResponseNotes] = useState<Record<string, string>>({});

  // New request form state
  const [newTargetWorkerId, setNewTargetWorkerId] = useState(workers[0]?.id || '');
  const [newRequestType, setNewRequestType] = useState<ApprovalRequestType>('work_record_confirmation');
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newAmount, setNewAmount] = useState<number>(650);

  if (!isApprovalsModalOpen) return null;

  const filteredRequests = approvalRequests.filter(req => {
    if (activeTab === 'pending') return req.status === 'simulated_pending';
    if (activeTab === 'resolved') return req.status !== 'simulated_pending';
    return true;
  });

  const pendingCount = approvalRequests.filter(r => r.status === 'simulated_pending').length;

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const target = workers.find(w => w.id === newTargetWorkerId) || workers[0];
    addApprovalRequest({
      type: newRequestType,
      requesterRole: 'contractor',
      requesterName: `${contractor.representative} (${contractor.firmName})`,
      targetWorkerId: target.id,
      targetWorkerName: target.name,
      title: newTitle.trim() || 'Simulated Shift & Wage Confirmation',
      summary: newSummary.trim() || `Muster shift attendance and wage rate confirmation for ${target.name}.`,
      amount: newAmount > 0 ? newAmount : undefined,
    });

    setIsCreatingNew(false);
    setNewTitle('');
    setNewSummary('');
    setNewAmount(650);
  };

  const getStatusBadge = (status: ApprovalRequestStatus) => {
    switch (status) {
      case 'simulated_pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Simulated: Pending Worker Review</span>
          </span>
        );
      case 'simulated_approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Simulated: Approved by Worker</span>
          </span>
        );
      case 'simulated_rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Simulated: Rejected / Disputed</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeIcon = (type: ApprovalRequestType) => {
    switch (type) {
      case 'work_record_confirmation':
        return <FileCheck className="w-4 h-4 text-emerald-600" />;
      case 'wage_payment_disbursement':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'rate_correction':
      case 'dispute_resolution':
        return <Scale className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-[#E3E0D8]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="approvals-modal-title"
      >
        {/* Header */}
        <div className="bg-[#FAF9F5] border-b border-[#E3E0D8] px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#1B4332] text-white flex items-center justify-center shadow-sm">
              <Smartphone className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="approvals-modal-title" className="text-lg font-bold text-[#123524]">
                  {language === 'hi' ? 'सिम्युलेटेड क्रॉस-डिवाइस अनुमोदन' : 'Simulated Cross-Device Approvals'}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 rounded">
                  Local Simulation
                </span>
              </div>
              <p className="text-xs text-[#52796F]">
                {language === 'hi'
                  ? 'स्थानीय IndexedDB में संगृहीत · सुपबेस डिप्लॉयमेंट तक सिमुलेशन के रूप में चिह्नित'
                  : 'Persisted in local IndexedDB · Labelled simulation until Supabase multi-device sync next week'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setApprovalsModalOpen(false)}
            className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandatory Simulation Warning Notice Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 shrink-0 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="leading-relaxed">
            <strong>Mandatory Simulation Disclosure:</strong> Cross-device approval requests are currently simulated
            locally in browser IndexedDB. Live multi-device push notifications and authentication will connect with Supabase
            next week.
          </div>
        </div>

        {/* Content Tabs & Actions */}
        <div className="px-6 pt-4 pb-2 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#1B4332] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Requests ({approvalRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'resolved'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Resolved ({approvalRequests.length - pendingCount})
            </button>
          </div>

          <button
            onClick={() => setIsCreatingNew(!isCreatingNew)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isCreatingNew ? 'Cancel New' : 'Simulate New Request'}</span>
          </button>
        </div>

        {/* Body Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Create New Request Drawer */}
          {isCreatingNew && (
            <form onSubmit={handleCreateRequest} className="bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-[#1B4332]" />
                  Simulate Cross-Device Request from Contractor
                </h3>
                <span className="text-[11px] text-gray-500 font-mono">Persists in IndexedDB</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Target Artisan</label>
                  <select
                    value={newTargetWorkerId}
                    onChange={e => setNewTargetWorkerId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                  >
                    {workers.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.trade}) — {w.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Request Type</label>
                  <select
                    value={newRequestType}
                    onChange={e => setNewRequestType(e.target.value as ApprovalRequestType)}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                  >
                    <option value="work_record_confirmation">Muster Work Record Confirmation</option>
                    <option value="wage_payment_disbursement">Wage Payment Disbursement</option>
                    <option value="rate_correction">Rate / Overtime Correction</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-gray-700 mb-1">Request Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Overtime concrete pour confirmation"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={newAmount}
                    onChange={e => setNewAmount(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Summary Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Details of shift, hours, rate, or disbursement to be approved by worker..."
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#1B4332] hover:bg-[#123524] rounded flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Simulated Request</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Requests */}
          {filteredRequests.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500 text-xs">
              No approval requests match the selected filter.
            </div>
          ) : (
            filteredRequests.map(req => {
              const isPending = req.status === 'simulated_pending';

              return (
                <div
                  key={req.id}
                  className={`border rounded-lg p-4 transition-all ${
                    isPending
                      ? 'bg-amber-50/30 border-amber-300 shadow-sm'
                      : req.status === 'simulated_approved'
                      ? 'bg-white border-emerald-200'
                      : 'bg-white border-rose-200'
                  }`}
                >
                  {/* Top line with IDs and Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-gray-100">{getTypeIcon(req.type)}</span>
                      <span className="font-mono text-xs font-bold text-gray-900">{req.id}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500">{req.createdAt}</span>
                    </div>
                    {getStatusBadge(req.status)}
                  </div>

                  {/* Title & Summary */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#123524]">{req.title}</h4>
                      {req.amount !== undefined && (
                        <span className="text-sm font-bold font-mono text-[#1B4332]">
                          ₹{req.amount.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">{req.summary}</p>
                  </div>

                  {/* Parties Metadata */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-gray-100 text-xs text-gray-600 bg-gray-50/70 p-2.5 rounded">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>
                        <strong>Requester:</strong> {req.requesterName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>
                        <strong>Target Artisan:</strong> {req.targetWorkerName} ({req.targetWorkerId})
                      </span>
                    </div>
                  </div>

                  {/* Simulation Disclaimer Tag */}
                  <div className="mt-2.5 text-[11px] text-amber-800 bg-amber-100/60 border border-amber-200/80 rounded px-2.5 py-1">
                    ℹ️ <em>{req.simulationDisclaimer}</em>
                  </div>

                  {/* Response Note (if resolved) */}
                  {!isPending && req.respondedAt && (
                    <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                      <span>
                        <strong>Resolution Note:</strong> {req.responseNote || 'No notes logged'}
                      </span>
                      <span className="text-gray-400 font-mono text-[11px]">{req.respondedAt}</span>
                    </div>
                  )}

                  {/* Interactive Simulation Action Buttons (if pending) */}
                  {isPending && (
                    <div className="mt-3 pt-2.5 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                      <input
                        type="text"
                        placeholder="Optional simulation response note (e.g. Verified against chowk log)"
                        value={responseNotes[req.id] || ''}
                        onChange={e =>
                          setResponseNotes(prev => ({ ...prev, [req.id]: e.target.value }))
                        }
                        className="text-xs p-1.5 border border-gray-300 rounded flex-1 bg-white"
                      />
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() =>
                            respondToApprovalRequest(
                              req.id,
                              'simulated_rejected',
                              responseNotes[req.id] || 'Rejected in local simulation'
                            )
                          }
                          className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Simulate Rejection</span>
                        </button>
                        <button
                          onClick={() =>
                            respondToApprovalRequest(
                              req.id,
                              'simulated_approved',
                              responseNotes[req.id] || 'Worker approved via simulated digital pass'
                            )
                          }
                          className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Simulate Worker Approval</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#FAF9F5] border-t border-[#E3E0D8] px-6 py-3 flex items-center justify-between shrink-0">
          <span className="text-xs text-gray-500">
            Total Approval Records in IndexedDB: <strong>{approvalRequests.length}</strong>
          </span>
          <button
            onClick={() => setApprovalsModalOpen(false)}
            className="px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
