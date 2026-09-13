import React, { useState } from 'react';
import { useApplication } from '../../context/ApplicationContext';
import { useToast } from '../../context/ToastContext';
import { storageService } from '../../services/storageService';
import { Send, FileText, CheckCircle2, AlertTriangle, Eye, User, Sparkles } from 'lucide-react';

export const CommunicationsPage: React.FC = () => {
  const { applications } = useApplication();
  const { success } = useToast();

  const [recipientAppId, setRecipientAppId] = useState('ADVS-NFST-2026-00482');
  const [templateType, setTemplateType] = useState<'deficiency' | 'clarification' | 'selection'>('deficiency');
  const [subject, setSubject] = useState('Urgent: Document Deficiency Notice regarding Income Certificate');
  const [content, setContent] = useState(
    'Dear Aarav Kumar,\n\nDuring automated AI-assisted scrutiny of your application for National Fellowship for ST (NFST), it was observed that the uploaded Annual Family Income Certificate appears to have lapsed beyond the 12-month validity window. Kindly upload a valid Revenue Authority certificate for FY 2026-27 through the Deficiency Center to enable resumption of official scrutiny.'
  );

  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const selectedApp = applications.find((a) => a.id === recipientAppId) || applications[0];

  const handleTemplateChange = (type: 'deficiency' | 'clarification' | 'selection') => {
    setTemplateType(type);
    if (type === 'deficiency') {
      setSubject('Action Required: Document Deficiency Notice');
      setContent(
        `Dear ${selectedApp?.applicantName},\n\nYour application ${selectedApp?.id} requires updated documentation. Please inspect the flagged document in the Deficiency Center and upload a compliant replacement at your earliest convenience.`
      );
    } else if (type === 'clarification') {
      setSubject('Clarification Request: Enrolment Status & Research Supervisor');
      setContent(
        `Dear ${selectedApp?.applicantName},\n\nThe Scrutiny Committee requests additional clarification regarding your regular Ph.D enrolment letter. Please reply via the portal messaging module within 7 calendar days.`
      );
    } else {
      setSubject('Congratulations: Provisional Selection for National Fellowship for ST (NFST)');
      setContent(
        `Dear ${selectedApp?.applicantName},\n\nWe are pleased to inform you that upon comprehensive merit evaluation, you have been shortlisted for the provisional award of National Fellowship for Scheduled Tribes (NFST) for the academic tenure 2026–2031.`
      );
    }
  };

  const handleSendMessage = () => {
    // Add to storage and trigger notification for applicant
    storageService.addNotification({
      title: subject,
      message: content.slice(0, 140) + '...',
      type: templateType === 'selection' ? 'celebration' : templateType === 'deficiency' ? 'warning' : 'info',
      applicationId: recipientAppId,
      actionUrl: templateType === 'deficiency' ? '/applicant/deficiencies' : `/applicant/applications/${recipientAppId}`,
      actionLabel: 'View Notice',
    });

    success('Communication Dispatched', `Official notice sent to ${selectedApp?.applicantName} (${selectedApp?.id}).`);
    setPreviewModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
            Official Correspondence
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Communication & Notice Dispatcher (मंत्रालय पत्राचार केंद्र)
          </h1>
          <p className="text-xs text-slate-500 font-hindi">
            आवेदकों को औपचारिक सूचनाएं, त्रुटि नोटिस एवं चयन पत्रों का प्रेषण
          </p>
        </div>
      </div>

      {/* Main Composer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Composer (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs">
          <h3 className="text-sm font-bold text-slate-900 border-b pb-3 uppercase tracking-wider">
            Compose Official Notice
          </h3>

          {/* Recipient Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Target Application / Scholar</label>
              <select
                value={recipientAppId}
                onChange={(e) => setRecipientAppId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                {applications.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.id} — {a.applicantName} ({a.schemeCode})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Notice Template</label>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleTemplateChange('deficiency')}
                  className={`flex-1 py-1.5 px-2 rounded-lg border font-semibold ${
                    templateType === 'deficiency'
                      ? 'bg-amber-100 text-amber-900 border-amber-400'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Deficiency Notice
                </button>
                <button
                  type="button"
                  onClick={() => handleTemplateChange('clarification')}
                  className={`flex-1 py-1.5 px-2 rounded-lg border font-semibold ${
                    templateType === 'clarification'
                      ? 'bg-blue-100 text-blue-900 border-blue-400'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Clarification
                </button>
                <button
                  type="button"
                  onClick={() => handleTemplateChange('selection')}
                  className={`flex-1 py-1.5 px-2 rounded-lg border font-semibold ${
                    templateType === 'selection'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Selection Letter
                </button>
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
            />
          </div>

          {/* Message Textarea */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Official Letter Body</label>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-300 bg-white font-mono leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setPreviewModalOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Official Letter</span>
            </button>

            <button
              type="button"
              onClick={handleSendMessage}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white shadow-md transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmit & Notify Scholar</span>
            </button>
          </div>
        </div>

        {/* Right Info Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 border-b pb-3">
            Recipient Target Summary
          </h3>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={selectedApp?.applicantPhoto || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'}
                alt={selectedApp?.applicantName}
                className="w-10 h-10 rounded-full border border-emerald-800 object-cover"
              />
              <div className="min-w-0">
                <div className="font-bold text-slate-900 truncate">{selectedApp?.applicantName}</div>
                <div className="text-[10px] text-slate-500 font-mono">{selectedApp?.id}</div>
              </div>
            </div>

            <div className="space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Scheme:</span>
                <span className="font-bold text-slate-800">{selectedApp?.schemeCode}</span>
              </div>
              <div className="flex justify-between">
                <span>State:</span>
                <span className="font-medium text-slate-800">{selectedApp?.state}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-mono text-[11px] text-slate-800">{selectedApp?.formData.email}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 text-[11px] leading-relaxed">
              <strong>Notice Delivery Guarantee:</strong> All dispatched communications immediately reflect in the applicant's notification inbox and digital activity log.
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="border-b pb-3 text-center">
              <div className="text-xs font-bold text-amber-700">MINISTRY OF TRIBAL AFFAIRS, GOVT. OF INDIA</div>
              <h3 className="text-sm font-black text-slate-900 mt-0.5">{subject}</h3>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl whitespace-pre-wrap font-mono text-xs text-slate-800 leading-relaxed max-h-60 overflow-y-auto">
              {content}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close Preview
              </button>
              <button
                onClick={handleSendMessage}
                className="px-6 py-2 rounded-xl text-xs font-bold bg-[#0D3829] text-white hover:bg-[#16533D]"
              >
                Send Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
