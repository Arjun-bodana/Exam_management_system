import React, { useState } from 'react';
import {
  ShieldCheck,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  Sliders,
  Users,
  CheckCircle,
  AlertTriangle,
  FileCode,
  Printer,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { AuditLogEntry, UserRole } from '../types';
import { exportAuditLogsToGoogleSheets, ExportResult } from '../services/googleSheets';

interface AuditAndAnalyticsProps {
  logs: AuditLogEntry[];
}

export const AuditAndAnalytics: React.FC<AuditAndAnalyticsProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [aiSensitivity, setAiSensitivity] = useState(85);
  const [maxTabSwitches, setMaxTabSwitches] = useState(3);
  const [gazeThresholdDeg, setGazeThresholdDeg] = useState(35);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (roleFilter !== 'ALL' && log.role !== roleFilter) return false;
    return true;
  });

  const [isExportingSheets, setIsExportingSheets] = useState(false);
  const [sheetsResult, setSheetsResult] = useState<ExportResult | null>(null);
  const [sheetsError, setSheetsError] = useState<string | null>(null);
  const [showSheetsConfirm, setShowSheetsConfirm] = useState(false);

  const handleExportToGoogleSheets = async () => {
    setShowSheetsConfirm(false);
    setIsExportingSheets(true);
    setSheetsError(null);
    try {
      const result = await exportAuditLogsToGoogleSheets(filteredLogs);
      setSheetsResult(result);
    } catch (err: any) {
      console.error('Failed to export to Google Sheets:', err);
      setSheetsError(err?.message || 'Failed to create and export Google Sheet.');
    } finally {
      setIsExportingSheets(false);
    }
  };

  const exportAsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'parikshvision_audit_logs.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportAsXml = () => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<AuditLedger>\n';
    filteredLogs.forEach((log) => {
      xml += `  <Log id="${log.id}">\n`;
      xml += `    <Timestamp>${log.timestamp}</Timestamp>\n`;
      xml += `    <UserEmail>${log.userEmail}</UserEmail>\n`;
      xml += `    <Role>${log.role}</Role>\n`;
      xml += `    <Action>${log.action}</Action>\n`;
      xml += `    <Entity>${log.entity}</Entity>\n`;
      xml += `    <Status>${log.status}</Status>\n`;
      xml += `    <IPAddress>${log.ipAddress}</IPAddress>\n`;
      xml += `    <SHA256Hash>${log.hash}</SHA256Hash>\n`;
      xml += `  </Log>\n`;
    });
    xml += '</AuditLedger>';

    const dataStr = 'data:text/xml;charset=utf-8,' + encodeURIComponent(xml);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'parikshvision_audit_ledger.xml');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const printPdfReport = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-[#f8f9ff]">
      {/* Header Banner */}
      <div className="bg-white rounded-lg p-5 shadow-xs border border-[#e2e8f0] mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#0051d5]" />
            <h1 className="text-lg font-bold text-[#0b1c30]">
              System Administration, Immutable Audit Logs & Telemetry Export
            </h1>
          </div>
          <p className="text-xs text-[#45464d] mt-1">
            WORM (Write Once, Read Many) forensic audit trail with SHA-256 cryptographic verification.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Google Sheets Export Button */}
          <button
            onClick={() => setShowSheetsConfirm(true)}
            disabled={isExportingSheets}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-3 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Export audit records directly to a Google Sheets spreadsheet"
          >
            {isExportingSheets ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-3.5 h-3.5" />
            )}
            <span>{isExportingSheets ? 'Exporting...' : 'Export to Google Sheets'}</span>
          </button>

          <button
            onClick={printPdfReport}
            className="bg-[#131b2e] hover:bg-[#213145] text-white text-xs font-bold px-3 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF Report</span>
          </button>
          <button
            onClick={exportAsJson}
            className="bg-[#0051d5] hover:bg-[#003ea8] text-white text-xs font-bold px-3 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={exportAsXml}
            className="bg-[#e5eeff] hover:bg-[#dce9ff] text-[#0051d5] border border-[#cbdbf5] text-xs font-bold px-3 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Export XML</span>
          </button>
        </div>
      </div>

      {/* Google Sheets Export Notification / Link Banner */}
      {sheetsResult && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-emerald-900">
                Audit Ledger successfully exported to Google Sheets! ({sheetsResult.rowCount} records)
              </div>
              <div className="text-emerald-700 text-[11px] truncate max-w-md">
                Spreadsheet ID: {sheetsResult.spreadsheetId}
              </div>
            </div>
          </div>
          <a
            href={sheetsResult.spreadsheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded transition-colors shadow-xs shrink-0"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Open in Google Sheets</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Google Sheets Error Banner */}
      {sheetsError && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-3 mb-5 flex items-center gap-2 text-xs text-red-800">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>Error exporting to Google Sheets: {sheetsError}</span>
        </div>
      )}

      {/* Confirmation Modal for Google Sheets Export */}
      {showSheetsConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-slate-200">
            <div className="flex items-center gap-2.5 text-emerald-700 mb-3">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-[#0b1c30]">Export Audit Ledger to Google Sheets</h3>
            </div>
            <p className="text-xs text-[#45464d] leading-relaxed mb-4">
              This will create a new Google Sheet named <span className="font-bold text-[#0b1c30]">"ParikshVision Audit Ledger"</span> in your connected Google Drive account and sync all <span className="font-bold text-[#0b1c30]">{filteredLogs.length}</span> immutable forensic records.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setShowSheetsConfirm(false)}
                className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExportToGoogleSheets}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded transition-colors shadow-xs"
              >
                Confirm & Create Google Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Settings & AI Threshold Configuration Box */}
      <div className="bg-white rounded-lg p-5 shadow-xs border border-[#e2e8f0] mb-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#0051d5] mb-3 flex items-center gap-1.5">
          <Sliders className="w-4 h-4" /> Global AI Sensitivity & Disqualification Policies
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#eff4ff] p-3 rounded border border-[#d3e4fe]">
            <div className="flex justify-between font-bold text-slate-800 mb-1">
              <span>YOLO / MediaPipe Confidence:</span>
              <span className="text-[#0051d5]">{aiSensitivity}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={aiSensitivity}
              onChange={(e) => setAiSensitivity(Number(e.target.value))}
              className="w-full accent-[#0051d5] cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Threshold for phone & multi-person auto-flags</span>
          </div>

          <div className="bg-[#eff4ff] p-3 rounded border border-[#d3e4fe]">
            <div className="flex justify-between font-bold text-slate-800 mb-1">
              <span>Max Tab-Switches Allowed:</span>
              <span className="text-red-700 font-extrabold">{maxTabSwitches} Swaps</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={maxTabSwitches}
              onChange={(e) => setMaxTabSwitches(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Auto-locks and forfeits exam upon reaching ceiling</span>
          </div>

          <div className="bg-[#eff4ff] p-3 rounded border border-[#d3e4fe]">
            <div className="flex justify-between font-bold text-slate-800 mb-1">
              <span>Gaze Deviation Angle:</span>
              <span className="text-amber-700 font-bold">{gazeThresholdDeg}°</span>
            </div>
            <input
              type="range"
              min="15"
              max="60"
              value={gazeThresholdDeg}
              onChange={(e) => setGazeThresholdDeg(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Yaw/Pitch angle triggering head-turn warnings</span>
          </div>
        </div>
      </div>

      {/* Immutable Audit Trail Table */}
      <div className="bg-white rounded-lg p-5 shadow-xs border border-[#e2e8f0]">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by action, user email, or log ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs text-slate-800 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 max-w-full">
            <span className="font-bold text-slate-500 shrink-0">Role:</span>
            {['ALL', 'STUDENT', 'PROCTOR', 'TEACHER', 'ADMIN'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-2.5 py-1.5 rounded font-semibold transition-colors shrink-0 cursor-pointer min-h-[36px] ${
                  roleFilter === r ? 'bg-[#0051d5] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* MOBILE VIEW: Stacked Responsive Cards (md:hidden) */}
        <div className="md:hidden space-y-3 mt-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-[#eff4ff] p-3 rounded-lg border border-[#d3e4fe] flex flex-col gap-2 text-xs"
            >
              <div className="flex items-center justify-between border-b border-[#cbdbf5] pb-1.5">
                <span className="font-mono font-bold text-[#0051d5]">{log.id}</span>
                {log.status === 'SUCCESS' ? (
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                    VERIFIED
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-[10px] font-bold">
                    VIOLATION
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[9.5px] uppercase font-bold">User</span>
                  <span className="font-semibold text-slate-800 truncate block">{log.userEmail}</span>
                  <span className="text-[10px] text-slate-500 uppercase">{log.role}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9.5px] uppercase font-bold">Timestamp</span>
                  <span className="font-mono text-slate-600 text-[10.5px]">{log.timestamp}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[9.5px] uppercase font-bold">Action & Entity</span>
                <span className="font-semibold text-slate-900">{log.action}</span>
                <span className="text-slate-600 text-[11px] block">{log.entity}</span>
              </div>

              <div className="pt-1 border-t border-[#cbdbf5] text-[10px] font-mono text-slate-500 truncate">
                <span>Hash: {log.hash}</span>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP VIEW: Full Data Table (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto mt-3">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#eff4ff] text-[#45464d] border-b border-[#d3e4fe]">
                <th className="p-2 font-bold">Log ID</th>
                <th className="p-2 font-bold">Timestamp UTC</th>
                <th className="p-2 font-bold">User</th>
                <th className="p-2 font-bold">Action Performed</th>
                <th className="p-2 font-bold">Target Entity</th>
                <th className="p-2 font-bold">Status</th>
                <th className="p-2 font-bold">Cryptographic Ledger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-2 font-mono font-bold text-[#0051d5]">{log.id}</td>
                  <td className="p-2 font-mono text-slate-600 text-[11px]">{log.timestamp}</td>
                  <td className="p-2">
                    <span className="font-semibold text-slate-800 block">{log.userEmail}</span>
                    <span className="text-[10px] text-slate-500 uppercase">{log.role}</span>
                  </td>
                  <td className="p-2 font-semibold text-slate-800">{log.action}</td>
                  <td className="p-2 text-slate-600">{log.entity}</td>
                  <td className="p-2">
                    {log.status === 'SUCCESS' ? (
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                        VERIFIED
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-[10px] font-bold">
                        VIOLATION
                      </span>
                    )}
                  </td>
                  <td className="p-2 font-mono text-[10px] text-slate-500">{log.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
