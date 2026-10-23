'use client';

import React from 'react';
import {
  X,
  PieChart,
  BarChart3,
  TrendingUp,
  Activity,
  Bot,
  Table,
  Check,
  Plus,
} from 'lucide-react';

interface WidgetOption {
  id: string;
  title: string;
  description: string;
  tag: string;
  icon: any;
  enabled: boolean;
}

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  enabledWidgets: Record<string, boolean>;
  onToggleWidget: (widgetId: string) => void;
}

export const AddWidgetModal: React.FC<AddWidgetModalProps> = ({
  isOpen,
  onClose,
  enabledWidgets,
  onToggleWidget,
}) => {
  if (!isOpen) return null;

  const availableWidgets: WidgetOption[] = [
    {
      id: 'timeline',
      title: 'Interaction Volume Timeline',
      description: 'Track how calls and meetings distributed across the hours of 21 August 2026.',
      tag: '#ActivityTrends',
      icon: TrendingUp,
      enabled: enabledWidgets.timeline ?? true,
    },
    {
      id: 'repActivity',
      title: 'Representative Activity Bar',
      description: 'Monitor individual outbound dials and meeting sessions per rep and organizer.',
      tag: '#Operations',
      icon: BarChart3,
      enabled: enabledWidgets.repActivity ?? true,
    },
    {
      id: 'coverageGauge',
      title: 'Transcript Coverage Meter',
      description: 'Radial meter displaying qualitative dialogue coverage (18 of 44 interactions).',
      tag: '#DataQuality',
      icon: Activity,
      enabled: enabledWidgets.coverageGauge ?? true,
    },
    {
      id: 'aiAssistant',
      title: 'AI Revenue Copilot / Assistant',
      description: 'Interactive natural language query assistant for instant synthesis across records.',
      tag: '#Intelligence',
      icon: Bot,
      enabled: enabledWidgets.aiAssistant ?? true,
    },
    {
      id: 'keyConversations',
      title: 'Priority Interactions & Evidence Table',
      description: 'Detailed list of high-impact commercial opportunities and critical customer defects.',
      tag: '#Pipeline',
      icon: Table,
      enabled: enabledWidgets.keyConversations ?? true,
    },
    {
      id: 'routingBreakdown',
      title: 'Routing Taxonomy Distribution',
      description: 'Breakdown of conversations assigned across the 6 governance destinations.',
      tag: '#Governance',
      icon: PieChart,
      enabled: enabledWidgets.routingBreakdown ?? true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-end p-4 sm:p-6 transition-all">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md h-full max-h-[90vh] shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-200">
        {/* Modal Header (Matching Dribbble Add Widget header) */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Dashboard Widgets</h3>
            <p className="text-xs text-slate-400 mt-0.5">Customize your revenue intelligence workspace</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Widgets List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {availableWidgets.map((widget) => {
            const Icon = widget.icon;
            const isEnabled = widget.enabled;
            return (
              <div
                key={widget.id}
                className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                  isEnabled
                    ? 'border-blue-200 bg-blue-50/40 dark:bg-blue-950/20 dark:border-blue-900/60 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`p-2.5 rounded-xl ${
                    isEnabled
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">{widget.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {widget.description}
                    </p>
                    <span className="inline-block text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-950 px-2 py-0.5 rounded-md mt-1">
                      {widget.tag}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onToggleWidget(widget.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                    isEnabled
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  {isEnabled ? (
                    <span className="flex items-center space-x-1">
                      <Check className="h-3 w-3" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span>Add</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {Object.values(enabledWidgets).filter(Boolean).length} Active Widgets
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
