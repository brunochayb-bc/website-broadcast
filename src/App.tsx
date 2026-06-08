/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, ReactNode } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { 
  TrendingUp, 
  Users, 
  MousePointer2, 
  FileText, 
  Info,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RAW_DATA, COLORS } from './constants';
import { PeriodFilter, ChartType } from './types';
import { cn, formatNum } from './lib/utils';
import WeekendDashboard from './components/WeekendDashboard';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function App() {
  const [activeTab, setActiveTab] = useState<'audiencia' | 'weekend'>('audiencia');
  const [period, setPeriod] = useState<PeriodFilter>('all');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [isTableExpanded, setIsTableExpanded] = useState(false);

  // Filtered data logic
  const filteredData = useMemo(() => {
    let indices: number[] = [];
    if (period === 'all') {
      indices = RAW_DATA.labels.map((_, i) => i);
    } else if (period === '3months') {
      indices = RAW_DATA.labels.map((_, i) => i).slice(-3);
    } else if (period === '2025') {
      indices = RAW_DATA.labels.map((l, i) => l.endsWith('25') ? i : null).filter((v): v is number => v !== null);
    } else if (period === '2026') {
      indices = RAW_DATA.labels.map((l, i) => l.endsWith('26') ? i : null).filter((v): v is number => v !== null);
    } else {
      // Handle individual month selection
      const monthIndex = RAW_DATA.labels.indexOf(period);
      if (monthIndex !== -1) {
        indices = [monthIndex];
      } else {
        indices = RAW_DATA.labels.map((_, i) => i);
      }
    }

    return {
      labels: indices.map(i => RAW_DATA.labels[i]),
      users: indices.map(i => RAW_DATA.users[i]),
      sessions: indices.map(i => RAW_DATA.sessions[i]),
      pages: indices.map(i => RAW_DATA.pages[i]),
      indices
    };
  }, [period]);

  const calculateGrowth = (data: number[], firstIndex: number) => {
    if (data.length < 2) {
      if (firstIndex === 0) return 0;
      const current = data[0];
      const previous = RAW_DATA.users[firstIndex - 1];
      return Number((((current - previous) / previous) * 100).toFixed(1));
    }
    const curr = data[data.length - 1];
    const prev = data[data.length - 2];
    return Number((((curr - prev) / prev) * 100).toFixed(1));
  };

  const stats = useMemo(() => {
    const totalUsers = filteredData.users.reduce((a, b) => a + b, 0);
    const totalSessions = filteredData.sessions.reduce((a, b) => a + b, 0);
    const totalPages = filteredData.pages.reduce((a, b) => a + b, 0);

    return {
      users: {
        total: totalUsers,
        avg: Math.round(totalUsers / filteredData.users.length),
        growth: calculateGrowth(filteredData.users, filteredData.indices[0])
      },
      sessions: {
        total: totalSessions,
        avg: Math.round(totalSessions / filteredData.sessions.length),
        growth: calculateGrowth(filteredData.sessions, filteredData.indices[0])
      },
      pages: {
        total: totalPages,
        avg: Math.round(totalPages / filteredData.pages.length),
        growth: calculateGrowth(filteredData.pages, filteredData.indices[0])
      }
    };
  }, [filteredData]);

  // Moving Average Helper
  const calculateMA = (data: number[], p = 3) => {
    return data.map((_, index, arr) => {
      if (index < p - 1) return null;
      const subset = arr.slice(index - p + 1, index + 1);
      return Math.round(subset.reduce((a, b) => a + b, 0) / p);
    });
  };

  const chartConfig: ChartData<'bar' | 'line'> = {
    labels: RAW_DATA.labels,
    datasets: [
      {
        type: chartType,
        label: 'Usuários',
        data: RAW_DATA.users,
        backgroundColor: chartType === 'bar' ? COLORS.users.solid : COLORS.users.light,
        borderColor: COLORS.users.solid,
        borderWidth: chartType === 'line' ? 3 : 0,
        fill: chartType === 'line',
        tension: 0.3,
        borderRadius: chartType === 'bar' ? 6 : 0,
        pointRadius: chartType === 'line' ? 4 : 0,
        pointHoverRadius: chartType === 'line' ? 6 : 0,
        order: 2
      },
      {
        type: chartType,
        label: 'Sessões',
        data: RAW_DATA.sessions,
        backgroundColor: chartType === 'bar' ? COLORS.sessions.solid : COLORS.sessions.light,
        borderColor: COLORS.sessions.solid,
        borderWidth: chartType === 'line' ? 3 : 0,
        fill: chartType === 'line',
        tension: 0.3,
        borderRadius: chartType === 'bar' ? 6 : 0,
        pointRadius: chartType === 'line' ? 4 : 0,
        pointHoverRadius: chartType === 'line' ? 6 : 0,
        order: 2
      },
      {
        type: chartType,
        label: 'Page Views',
        data: RAW_DATA.pages,
        backgroundColor: chartType === 'bar' ? COLORS.pages.solid : COLORS.pages.light,
        borderColor: COLORS.pages.solid,
        borderWidth: chartType === 'line' ? 3 : 0,
        fill: chartType === 'line',
        tension: 0.3,
        borderRadius: chartType === 'bar' ? 6 : 0,
        pointRadius: chartType === 'line' ? 4 : 0,
        pointHoverRadius: chartType === 'line' ? 6 : 0,
        order: 2
      },
      // Trends
      {
        type: 'line',
        label: 'Trend Usuários',
        data: calculateMA(RAW_DATA.users),
        borderColor: COLORS.users.solid,
        borderDash: [6, 4],
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
        order: 1
      },
      {
        type: 'line',
        label: 'Trend Sessões',
        data: calculateMA(RAW_DATA.sessions),
        borderColor: COLORS.sessions.solid,
        borderDash: [6, 4],
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
        order: 1
      },
      {
        type: 'line',
        label: 'Trend Page Views',
        data: calculateMA(RAW_DATA.pages),
        borderColor: COLORS.pages.solid,
        borderDash: [6, 4],
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
        order: 1
      }
    ]
  };

  const chartOptions: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: { color: '#94a3b8', font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { weight: 500 } }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 25,
          font: { family: 'Inter', size: 12 },
          // @ts-ignore - filter exists but typing can be tricky in union charts
          filter: (item) => !item.text.includes('Trend')
        }
      },
      tooltip: {
        padding: 12,
        backgroundColor: '#0f172a',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 12,
        boxPadding: 6
      }
    }
  };

  const pageViewHighlights = useMemo(() => {
    const latestIdx = RAW_DATA.pages.length - 1;
    const current = RAW_DATA.pages[latestIdx];
    
    const getGrowth = (prevIdx: number) => {
      if (prevIdx < 0) return null;
      const prev = RAW_DATA.pages[prevIdx];
      return Number((((current - prev) / prev) * 100).toFixed(1));
    };

    return {
      vs30: getGrowth(latestIdx - 1),
      vs90: getGrowth(latestIdx - 3),
      vs360: getGrowth(latestIdx - 12)
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] executive-grid pb-16">
      {/* Header */}
      <header className="bg-white/85 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 shadow-sm shadow-slate-100/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center shadow-md shadow-slate-200 border border-slate-800">
              <TrendingUp className="w-4.5 h-4.5 text-amber-400" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 font-sans">
              broadcast<span className="text-indigo-600 font-semibold text-base">.com.br</span>
              <span className="ml-2 text-[10px] tracking-widest uppercase font-bold text-slate-400 border-l border-slate-200 pl-2 font-mono hidden sm:inline">Executive Suite</span>
            </h1>
          </div>

          {/* New navigation / tab switcher menu */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/50">
            <button
              onClick={() => setActiveTab('audiencia')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer",
                activeTab === 'audiencia'
                  ? "bg-white text-slate-900 shadow-sm font-bold border border-slate-200/45"
                  : "text-slate-500 hover:text-slate-800 font-semibold"
              )}
            >
              Audiência Geral
            </button>
            <button
              onClick={() => setActiveTab('weekend')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer",
                activeTab === 'weekend'
                  ? "bg-white text-slate-900 shadow-sm font-bold border border-slate-200/45"
                  : "text-slate-500 hover:text-slate-800 font-semibold"
              )}
            >
              Broadcast Weekend
            </button>
          </div>

          <div className="hidden lg:block text-[10px] text-slate-400 uppercase tracking-widest font-bold font-mono">
            Relatório de Performance 2025/26
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10 space-y-10">
        {activeTab === 'audiencia' ? (
          <>
            {/* Period Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded uppercase tracking-wider font-mono">C-Level Analytics</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Painel de Audiência Geral</h2>
                <p className="text-sm text-slate-500 mt-1">Série histórica de tráfego, audiência, sessões e visualizações mensais.</p>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 shadow-inner">
                <label htmlFor="periodFilter" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2 font-mono">
                  Filtrar Período:
                </label>
                <select
                  id="periodFilter"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as PeriodFilter)}
                  className="bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:ring-1 focus:ring-slate-900 cursor-pointer rounded-lg px-3 py-1.5 outline-none font-sans shadow-sm"
                >
                  <optgroup label="Comparações">
                    <option value="all">Série Histórica Completa</option>
                    <option value="3months">Últimos 3 Meses</option>
                    <option value="2025">Ano de 2025</option>
                    <option value="2026">Ano de 2026</option>
                  </optgroup>
                  <optgroup label="Meses Individuais">
                    {RAW_DATA.labels.map((label) => (
                      <option key={label} value={label}>
                        {label}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

        {/* PageView Growth Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <HighlightCard 
            label="Crescimento PageViews (30 dias)" 
            value={pageViewHighlights.vs30} 
            description="vs. período anterior"
          />
          <HighlightCard 
            label="Crescimento PageViews (90 dias)" 
            value={pageViewHighlights.vs90} 
            description="vs. 3 meses anteriores"
          />
          <HighlightCard 
            label="Crescimento PageViews (360 dias)" 
            value={pageViewHighlights.vs360} 
            description="vs. mesmo período ano anterior"
          />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            label="Usuários Únicos"
            value={stats.users.total}
            avg={stats.users.avg}
            growth={stats.users.growth}
            icon={<Users className="w-4 h-4 text-slate-500" />}
            colorClass="border-slate-800"
          />
          <KPICard
            label="Sessões Totais"
            value={stats.sessions.total}
            avg={stats.sessions.avg}
            growth={stats.sessions.growth}
            icon={<MousePointer2 className="w-4 h-4 text-slate-500" />}
            colorClass="border-emerald-700"
          />
          <KPICard
            label="Visualizações de Página"
            value={stats.pages.total}
            avg={stats.pages.avg}
            growth={stats.pages.growth}
            icon={<FileText className="w-4 h-4 text-slate-500" />}
            colorClass="border-indigo-700"
          />
        </div>

        {/* Chart Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800 font-sans tracking-tight">Tendência de Crescimento Mensal</h2>
              <p className="text-xs text-slate-400">Dados consolidados com média móvel para detecção de tendências</p>
            </div>
            
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/40">
              <button
                onClick={() => setChartType('bar')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer",
                  chartType === 'bar' 
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                Barras
              </button>
              <button
                onClick={() => setChartType('line')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer",
                  chartType === 'line' 
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                Linhas
              </button>
            </div>
          </div>
          
          <div className="p-6 bg-slate-50/20">
            <div className="h-[430px] w-full relative">
              {chartType === 'bar' ? (
                <Bar data={chartConfig as any} options={chartOptions as any} />
              ) : (
                <Line data={chartConfig as any} options={chartOptions as any} />
              )}
            </div>
          </div>
        </motion.div>

        {/* Table View */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden mb-8"
        >
          <button 
            onClick={() => setIsTableExpanded(!isTableExpanded)}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left outline-none cursor-pointer group"
          >
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 font-sans tracking-tight">
                  Detalhamento de Dados Mensais (DVP)
                </h2>
                <span className={cn(
                  "text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-all uppercase tracking-wider font-mono",
                  isTableExpanded 
                    ? "bg-slate-100 text-slate-600" 
                    : "bg-amber-50 text-amber-700 border border-amber-200/60"
                )}>
                  {isTableExpanded ? 'Recolher Dados' : 'Ver Dados Brutos'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Acesso à planilha completa contendo usuários, sessões e visualizações absolutas por competência</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-400 group-hover:text-amber-500 group-hover:bg-amber-50 group-hover:border-amber-100/80 transition-all">
              {isTableExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>
          
          <AnimatePresence initial={false}>
            {isTableExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden border-t border-slate-100 bg-white"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100">
                        <th className="px-6 py-4 font-bold text-slate-700">Competência</th>
                        <th className="px-6 py-4 text-right">Usuários Únicos</th>
                        <th className="px-6 py-4 text-right">Sessões Totais</th>
                        <th className="px-6 py-4 text-right">Visualizações de Página (PV)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/70 font-mono">
                      {RAW_DATA.labels.map((label, i) => (
                        <tr key={label} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-3.5 font-sans font-semibold text-slate-700">{label}</td>
                          <td className="px-6 py-3.5 text-right font-medium text-slate-800">{formatNum(RAW_DATA.users[i])}</td>
                          <td className="px-6 py-3.5 text-right text-slate-500">{formatNum(RAW_DATA.sessions[i])}</td>
                          <td className="px-6 py-3.5 text-right font-semibold text-indigo-950">{formatNum(RAW_DATA.pages[i])}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
          </>
        ) : (
          <WeekendDashboard />
        )}
      </main>
    </div>
  );
}

interface HighlightCardProps {
  label: string;
  value: number | null;
  description: string;
}

function HighlightCard({ label, value, description }: HighlightCardProps) {
  if (value === null) return null;
  const isPositive = value > 0;

  return (
    <div className={cn(
      "bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow duration-200",
      isPositive ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-rose-500"
    )}>
      <div className="flex-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className={cn(
            "text-2xl font-bold tracking-tight font-mono",
            isPositive ? "text-emerald-700" : "text-rose-700"
          )}>
            {isPositive ? '↑' : '↓'} {Math.abs(value)}%
          </span>
          <span className="text-xs text-slate-500 font-sans">{description}</span>
        </div>
      </div>
    </div>
  );
}

interface KPICardProps {
  label: string;
  value: number;
  avg: number;
  growth?: number;
  icon: ReactNode;
  colorClass?: string;
}

function KPICard({ label, value, avg, growth, icon, colorClass = "border-slate-800" }: KPICardProps) {
  const isPositive = growth !== undefined ? growth > 0 : null;

  return (
    <motion.div 
      whileHover={{ y: -3 }}
      className={cn(
        "bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 transition-all cursor-default flex flex-col justify-between border-t-4",
        colorClass
      )}
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            {label}
          </p>
          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
            {icon}
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {formatNum(value)}
          </h3>
          
          {growth !== undefined && (
            <span className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-full font-mono flex items-center gap-0.5",
              isPositive 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                : "bg-rose-50 text-rose-700 border border-rose-100"
            )}>
              {isPositive ? '▲' : '▼'} {Math.abs(growth)}%
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-5 pt-3 border-t border-slate-50 flex items-center gap-1.5 font-sans">
        <Info className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        <span>
          Média Mensal Consolidada: <span className="font-semibold text-slate-700 font-mono">{formatNum(avg)}</span>
        </span>
      </p>
    </motion.div>
  );
}
