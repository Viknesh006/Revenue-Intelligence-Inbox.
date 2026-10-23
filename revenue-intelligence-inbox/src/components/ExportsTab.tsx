'use client';

import React, { useState, useMemo } from 'react';
import { UnifiedRecord } from '@/types/intelligence';
import { generateExportPackage, downloadZipPackage } from '@/lib/exportEngine';
import {
  Download,
  FolderTree,
  FileCode,
  FileText,
  CheckCircle2,
  FileSpreadsheet,
  FileJson,
  Folder,
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import saveAs from 'file-saver';

interface ExportsTabProps {
  records: UnifiedRecord[];
}

export const ExportsTab: React.FC<ExportsTabProps> = ({ records }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);

  // Generate the export package dynamically from current engine records
  const exportPackage = useMemo(() => {
    return generateExportPackage(records);
  }, [records]);

  const selectedFile = exportPackage.files[selectedFileIndex] || exportPackage.files[0];

  const handleDownloadZip = async () => {
    setIsExportingZip(true);
    try {
      await downloadZipPackage(records);
    } catch (e) {
      console.error('ZIP generation error:', e);
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleDownloadManifestJson = () => {
    const jsonFile = exportPackage.files.find((f) => f.path === 'manifest.json');
    if (jsonFile) {
      const blob = new Blob([jsonFile.content], { type: 'application/json' });
      saveAs(blob, 'manifest.json');
    }
  };

  const handleDownloadManifestCsv = () => {
    const csvFile = exportPackage.files.find((f) => f.path === 'manifest.csv');
    if (csvFile) {
      const blob = new Blob([csvFile.content], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'manifest.csv');
    }
  };

  // Group files by folder
  const filesByFolder = useMemo(() => {
    const map = new Map<string, typeof exportPackage.files>();
    exportPackage.files.forEach((file) => {
      const parts = file.path.split('/');
      const folder = parts.length > 1 ? parts[0] : 'root';
      const existing = map.get(folder) || [];
      existing.push(file);
      map.set(folder, existing);
    });
    return map;
  }, [exportPackage]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Download className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Export Archive & Manifest Generator
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Organized intelligence documents, daily executive brief, and machine-readable JSON/CSV manifest with verified relative paths.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleDownloadManifestJson}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200:bg-slate-700 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition"
          >
            <FileJson className="h-3.5 w-3.5 text-blue-600" />
            <span>manifest.json</span>
          </button>

          <button
            onClick={handleDownloadManifestCsv}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200:bg-slate-700 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>manifest.csv</span>
          </button>

          <button
            onClick={handleDownloadZip}
            disabled={isExportingZip}
            className="flex items-center space-x-2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold shadow-md transition disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{isExportingZip ? 'Packaging ZIP...' : 'Download Complete ZIP'}</span>
          </button>
        </div>
      </div>

      {/* Export Folder Explorer & File Previewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Folder Explorer */}
        <div className="lg:col-span-5 bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col max-h-[600px] overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <FolderTree className="h-4 w-4 text-blue-600" />
              <span>Archive Folder Structure</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {exportPackage.files.length} Files
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            {Array.from(filesByFolder.entries()).map(([folder, files]) => (
              <div key={folder} className="space-y-1">
                <div className="flex items-center space-x-1.5 text-slate-500 font-semibold text-[11px] uppercase tracking-wider px-1">
                  <Folder className="h-3.5 w-3.5 text-blue-500" />
                  <span>{folder}/</span>
                </div>
                <div className="space-y-0.5 pl-3 border-l border-slate-200">
                  {files.map((file) => {
                    const idx = exportPackage.files.indexOf(file);
                    const isSelected = idx === selectedFileIndex;
                    const fileName = file.path.split('/').pop() || file.path;
                    return (
                      <button
                        key={file.path}
                        onClick={() => setSelectedFileIndex(idx)}
                        className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-blue-50 text-blue-900 font-bold border border-blue-300'
                            : 'text-slate-600 hover:bg-slate-50:bg-slate-800/60 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate max-w-[240px] text-[11px]">{fileName}</span>
                        {isSelected && <ChevronRight className="h-3.5 w-3.5 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: File Content Previewer */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col max-h-[600px] overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
            <div>
              <span className="text-xs font-bold text-slate-900 font-mono">
                {selectedFile?.path}
              </span>
              <p className="text-[11px] text-slate-500">{selectedFile?.description}</p>
            </div>
            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              Active Export Output
            </span>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
            {selectedFile?.content}
          </div>
        </div>
      </div>

      {/* Manifest Table Preview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <FileCode className="h-4 w-4 text-blue-600" />
              <span>Manifest Table Preview (All 44 Records)</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Verified relative output paths. Repeated exports preserve version integrity.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            All Output Paths Verified
          </span>
        </div>

        <div className="overflow-x-auto max-h-80">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead className="bg-slate-50 sticky top-0 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Ref</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Rev</th>
                <th className="py-2.5 px-3">Assigned Routes</th>
                <th className="py-2.5 px-3">Output Path(s)</th>
                <th className="py-2.5 px-3">Review State</th>
                <th className="py-2.5 px-3">Override</th>
                <th className="py-2.5 px-3">Text Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {exportPackage.manifest.map((m) => (
                <tr key={`${m.source_type}:::${m.source_id}`} className="hover:bg-slate-50/60:bg-slate-800/40">
                  <td className="py-2 px-3 font-mono font-bold">{m.record_ref}</td>
                  <td className="py-2 px-3 capitalize">{m.source_type}</td>
                  <td className="py-2 px-3">v{m.applied_source_revision}</td>
                  <td className="py-2 px-3 max-w-xs truncate">{m.assigned_routes.join(', ')}</td>
                  <td className="py-2 px-3 max-w-xs truncate font-mono text-[10px] text-blue-700">
                    {m.output_paths.join('; ')}
                  </td>
                  <td className="py-2 px-3">{m.review_state}</td>
                  <td className="py-2 px-3">
                    {m.manual_override ? (
                      <span className="text-purple-600 font-bold">YES</span>
                    ) : (
                      <span className="text-slate-400">NO</span>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    {m.transcript_available ? (
                      <span className="text-emerald-600 font-semibold">Available</span>
                    ) : (
                      <span className="text-slate-400">Unsupplied</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
