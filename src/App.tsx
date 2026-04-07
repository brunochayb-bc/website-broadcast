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
  const [period, setPeriod] = useState<PeriodFilter>('all');
  const [chartType, setChartType] = useState<ChartType>('bar');

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
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              broadcast<span className="text-indigo-600">.com.br</span>
            </h1>
          </div>
          <div className="hidden sm:block text-sm text-slate-500 font-medium">
            Relatório de Performance 2025/26
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 space-y-8">
        {/* Period Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
            <p className="text-sm text-slate-500">Métricas consolidadas de tráfego e engajamento.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <label htmlFor="periodFilter" className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">
              Período:
            </label>
            <select
              id="periodFilter"
              value={period}
              onChange={(e) => setPeriod(e.target.value as PeriodFilter)}
              className="bg-slate-50 border-none text-sm font-semibold text-indigo-600 focus:ring-0 cursor-pointer rounded-lg px-3 py-1.5 outline-none"
            >
              <optgroup label="Comparações">
                <option value="all">Tudo (Série Histórica)</option>
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
            description="vs. mês anterior"
          />
          <HighlightCard 
            label="Crescimento PageViews (90 dias)" 
            value={pageViewHighlights.vs90} 
            description="vs. 3 meses atrás"
          />
          <HighlightCard 
            label="Crescimento PageViews (360 dias)" 
            value={pageViewHighlights.vs360} 
            description="vs. mesmo mês ano anterior"
          />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            label="Usuários Únicos"
            value={stats.users.total}
            avg={stats.users.avg}
            icon={<Users className="w-4 h-4 text-slate-400" />}
          />
          <KPICard
            label="Sessões Totais"
            value={stats.sessions.total}
            avg={stats.sessions.avg}
            icon={<MousePointer2 className="w-4 h-4 text-slate-400" />}
          />
          <KPICard
            label="Visualizações de Página"
            value={stats.pages.total}
            avg={stats.pages.avg}
            icon={<FileText className="w-4 h-4 text-slate-400" />}
          />
        </div>

        {/* Chart Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Tendência de Crescimento</h2>
              <p className="text-xs text-slate-500">Visualização completa da série histórica</p>
            </div>
            
            <div className="inline-flex p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setChartType('bar')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                  chartType === 'bar' 
                    ? "bg-white text-indigo-600 shadow-sm border border-slate-200" 
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                Barras
              </button>
              <button
                onClick={() => setChartType('line')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                  chartType === 'line' 
                    ? "bg-white text-indigo-600 shadow-sm border border-slate-200" 
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                Linhas
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="h-[450px] w-full relative">
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
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Detalhamento Mensal</h2>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Tabela de Dados Brutos</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-tighter">
                  <th className="px-6 py-4">Mês</th>
                  <th className="px-6 py-4">Usuários</th>
                  <th className="px-6 py-4">Sessões</th>
                  <th className="px-6 py-4">Page Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RAW_DATA.labels.map((label, i) => (
                  <tr key={label} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-700">{label}</td>
                    <td className="px-6 py-4 text-slate-600">{formatNum(RAW_DATA.users[i])}</td>
                    <td className="px-6 py-4 text-slate-600">{formatNum(RAW_DATA.sessions[i])}</td>
                    <td className="px-6 py-4 text-slate-600">{formatNum(RAW_DATA.pages[i])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
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
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className={cn(
          "text-xl font-bold",
          isPositive ? "text-emerald-600" : "text-rose-600"
        )}>
          {isPositive ? '+' : ''}{value}%
        </span>
        <span className="text-xs text-slate-500">{description}</span>
      </div>
    </div>
  );
}

interface KPICardProps {
  label: string;
  value: number;
  avg: number;
  icon: ReactNode;
}

function KPICard({ label, value, avg, icon }: KPICardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-all"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            {label}
          </p>
          <h3 className="text-3xl font-bold text-slate-800 mt-1">{formatNum(value)}</h3>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">
          {icon}
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
        <Info className="w-3 h-3" />
        <span>Média Mensal: <span className="font-semibold text-slate-600">{formatNum(avg)}</span></span>
      </p>
    </motion.div>
  );
}
