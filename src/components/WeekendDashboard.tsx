import React, { useState, useMemo, ReactNode } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { 
  Mail, 
  MousePointer2, 
  Eye, 
  Users, 
  UserCheck, 
  CheckCircle, 
  XOctagon, 
  TrendingUp, 
  Globe,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { NEWSLETTER_DATA, HOTSITE_DATA } from '../weekend_constants';
import { cn, formatNum } from '../lib/utils';

export default function WeekendDashboard() {
  const [activeSubTab, setActiveSubTab] = useState<'newsletter' | 'hotsite'>('newsletter');

  // Calculated Stats
  const newsletterStats = useMemo(() => {
    const totalSent = NEWSLETTER_DATA.reduce((sum, item) => sum + item.emailsSent, 0);
    const totalDelivered = NEWSLETTER_DATA.reduce((sum, item) => sum + item.emailsDelivered, 0);
    const avgOpenRate = NEWSLETTER_DATA.reduce((sum, item) => sum + item.openRate, 0) / NEWSLETTER_DATA.length;
    const avgClickRate = NEWSLETTER_DATA.reduce((sum, item) => sum + item.clickRate, 0) / NEWSLETTER_DATA.length;
    const totalOptOut = NEWSLETTER_DATA.reduce((sum, item) => sum + item.optOut, 0);
    
    return {
      totalSent,
      avgSent: Math.round(totalSent / NEWSLETTER_DATA.length),
      totalDelivered,
      avgDelivered: Math.round(totalDelivered / NEWSLETTER_DATA.length),
      avgOpenRate: Number(avgOpenRate.toFixed(2)),
      avgClickRate: Number(avgClickRate.toFixed(2)),
      totalOptOut
    };
  }, []);

  const hotsiteStats = useMemo(() => {
    const totalViews = HOTSITE_DATA.reduce((sum, item) => sum + item.pageViews, 0);
    const totalUsers = HOTSITE_DATA.reduce((sum, item) => sum + item.users, 0);
    
    return {
      totalViews,
      avgViews: Math.round(totalViews / HOTSITE_DATA.length),
      totalUsers,
      avgUsers: Math.round(totalUsers / HOTSITE_DATA.length)
    };
  }, []);

  // Charts Configs
  const newsletterChartData: ChartData<'line'> = {
    labels: NEWSLETTER_DATA.map(item => item.date),
    datasets: [
      {
        label: 'Taxa de Abertura (%)',
        data: NEWSLETTER_DATA.map(item => item.openRate),
        borderColor: '#6366f1', // Indigo
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
        yAxisID: 'y_open'
      },
      {
        label: 'Taxa de Cliques (%)',
        data: NEWSLETTER_DATA.map(item => item.clickRate),
        borderColor: '#0d9488', // Teal
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
        yAxisID: 'y_click'
      }
    ]
  };

  const newsletterChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    scales: {
      y_open: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Abertura (%)',
          color: '#6366f1',
          font: { weight: 'bold', size: 11 }
        },
        ticks: { color: '#6366f1' },
        grid: { color: '#f1f5f9' },
        min: 10,
        max: 20
      },
      y_click: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Cliques (%)',
          color: '#0d9488',
          font: { weight: 'bold', size: 11 }
        },
        ticks: { color: '#0d9488' },
        grid: { drawOnChartArea: false }, // Only keep left grid lines
        min: 0,
        max: 2.5
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { weight: 500 } }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, padding: 15, font: { family: 'Inter', size: 12 } }
      }
    }
  };

  const hotsiteChartData: ChartData<'bar'> = {
    labels: HOTSITE_DATA.map(item => item.period),
    datasets: [
      {
        label: 'Page Views',
        data: HOTSITE_DATA.map(item => item.pageViews),
        backgroundColor: '#9333ea', // Purple
        borderColor: '#9333ea',
        borderRadius: 6,
        barPercentage: 0.5,
        categoryPercentage: 0.8
      },
      {
        label: 'Usuários Únicos',
        data: HOTSITE_DATA.map(item => item.users),
        backgroundColor: '#f59e0b', // Amber/Orange
        borderColor: '#f59e0b',
        borderRadius: 6,
        barPercentage: 0.5,
        categoryPercentage: 0.8
      }
    ]
  };

  const hotsiteChartOptions: ChartOptions<'bar'> = {
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
        labels: { usePointStyle: true, padding: 15, font: { family: 'Inter', size: 12 } }
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Sub tabs selector */}
      <div className="flex border-b border-slate-200/60 pb-px gap-2">
        <button
          onClick={() => setActiveSubTab('newsletter')}
          className={cn(
            "pb-3 px-5 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 cursor-pointer",
            activeSubTab === 'newsletter'
              ? "border-slate-800 text-slate-900 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-700"
          )}
        >
          <Mail className="w-4 h-4 text-slate-400" />
          Newsletter Broadcast Weekend
        </button>
        <button
          onClick={() => setActiveSubTab('hotsite')}
          className={cn(
            "pb-3 px-5 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 cursor-pointer",
            activeSubTab === 'hotsite'
              ? "border-slate-800 text-slate-900 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-700"
          )}
        >
          <Globe className="w-4 h-4 text-slate-400" />
          Hotsite Broadcast Weekend
        </button>
      </div>

      {activeSubTab === 'newsletter' ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Newsletter KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <KPIItem 
              label="E-mails Enviados" 
              value={newsletterStats.totalSent} 
              avg={newsletterStats.avgSent}
              icon={<Mail className="w-5 h-5 text-indigo-600" />}
              colorClass="border-indigo-700"
            />
            <KPIItem 
              label="E-mails Entregues" 
              value={newsletterStats.totalDelivered} 
              avg={newsletterStats.avgDelivered}
              icon={<CheckCircle className="w-5 h-5 text-teal-600" />}
              colorClass="border-teal-700"
            />
            <KPIItem 
              label="Taxa Média Abertura" 
              value={`${newsletterStats.avgOpenRate}%`} 
              avg="Histórico consolidado"
              icon={<Eye className="w-5 h-5 text-purple-600" />}
              isPercentage
              benchmark="21-25%"
              tooltipText="Fontes: Mailchimp, Brevo, WebFX, Wolf Financial — dados 2025/2026"
              colorClass="border-amber-600"
            />
            <KPIItem 
              label="Taxa Média Cliques" 
              value={`${newsletterStats.avgClickRate}%`} 
              avg="Histórico consolidado"
              icon={<MousePointer2 className="w-5 h-5 text-amber-600" />}
              isPercentage
              benchmark="2,5% - 3,1%"
              tooltipText="Fontes: Mailchimp, Brevo, WebFX, Wolf Financial — dados 2025/2026"
              colorClass="border-purple-700"
            />
          </div>

          {/* Engagement chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 font-sans tracking-tight">Engajamento da Newsletter</h3>
              <p className="text-xs text-slate-400 mt-1">Evolução percentual semanal da Taxa de Abertura vs. Taxa de Cliques</p>
            </div>
            <div className="p-6 bg-slate-50/10">
              <div className="h-[380px] w-full relative">
                <Line data={newsletterChartData} options={newsletterChartOptions} />
              </div>
            </div>
          </div>

          {/* Table representing exactly the Newsletter spreadsheet */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-sans tracking-tight">Planilha de Desempenho</h3>
                <p className="text-xs text-slate-400 mt-1">Série histórica de envio, distribuição e retorno (métrica por disparo)</p>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-50 px-2.5 py-1 rounded">Broadcast Weekend</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold font-mono uppercase tracking-wider text-[10px]">
                    <th className="px-6 py-4 font-bold text-[#0f172a] font-sans text-xs"># Newsletter Broadcast Weekend</th>
                    {NEWSLETTER_DATA.map(item => (
                      <th key={item.date} className="px-6 py-4 text-center">{item.date}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">Mailing automático (THOR &gt; RD)</td>
                    {NEWSLETTER_DATA.map(item => (
                      <td key={item.date} className="px-6 py-4 text-center text-slate-600 font-mono">{formatNum(item.thorMailing)}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">Mailing Não clientes</td>
                    {NEWSLETTER_DATA.map(item => (
                      <td key={item.date} className="px-6 py-4 text-center text-slate-600 font-mono">
                        {item.nonClientMailing === 0 ? '-' : formatNum(item.nonClientMailing)}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#0f172a]">E-mail enviados</td>
                    {NEWSLETTER_DATA.map(item => (
                      <td key={item.date} className="px-6 py-4 text-center font-semibold text-[#0f172a] font-mono">{formatNum(item.emailsSent)}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">E-mails entregues</td>
                    {NEWSLETTER_DATA.map(item => (
                      <td key={item.date} className="px-6 py-4 text-center text-slate-600 font-mono">{formatNum(item.emailsDelivered)}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">Taxa de abertura</td>
                    {NEWSLETTER_DATA.map(item => {
                      // Blue highlights matching spreadsheet
                      const isHighlighted = item.date === '16/Mai';
                      return (
                        <td 
                          key={item.date} 
                          className={cn(
                            "px-6 py-4 text-center font-mono font-medium",
                            isHighlighted ? "text-indigo-600 bg-indigo-50/30 rounded" : "text-slate-600"
                          )}
                        >
                          {item.openRate.toLocaleString('pt-BR')}% ({formatNum(item.openCount)})
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">Cliques (us. únicos)</td>
                    {NEWSLETTER_DATA.map(item => {
                      // Blue highlights matching spreadsheet
                      const isHighlighted = item.date === '23/Mai';
                      return (
                        <td 
                          key={item.date} 
                          className={cn(
                            "px-6 py-4 text-center font-mono font-medium",
                            isHighlighted ? "text-indigo-600 bg-indigo-50/30 rounded" : "text-slate-600"
                          )}
                        >
                          {item.clickRate.toLocaleString('pt-BR')}% ({formatNum(item.clickCount)})
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">Visualização no Browser</td>
                    {NEWSLETTER_DATA.map(item => (
                      <td key={item.date} className="px-6 py-4 text-center text-slate-600 font-mono">
                        {item.browserViews === 0 ? '-' : item.browserViews}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                    <td className="px-6 py-4 font-medium text-slate-700">Opt Out</td>
                    {NEWSLETTER_DATA.map(item => (
                      <td key={item.date} className="px-6 py-4 text-center text-slate-600 font-mono">
                        {item.optOut === 0 ? '-' : item.optOut}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Hotsite KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <KPIItem 
              label="Hotsite Page Views (Total)" 
              value={hotsiteStats.totalViews} 
              avg={hotsiteStats.avgViews}
              icon={<Eye className="w-5 h-5 text-purple-600" />}
              colorClass="border-indigo-700"
            />
            <KPIItem 
              label="Hotsite Usuários Únicos (Total)" 
              value={hotsiteStats.totalUsers} 
              avg={hotsiteStats.avgUsers}
              icon={<Users className="w-5 h-5 text-amber-600" />}
              colorClass="border-amber-600"
            />
          </div>

          {/* Hotsite Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 font-sans tracking-tight">Visualizações vs Usuários Únicos</h3>
              <p className="text-xs text-slate-400 mt-1">Relação semanal de audiência no hotsite Broadcast Weekend</p>
            </div>
            <div className="p-6 bg-slate-50/10">
              <div className="h-[380px] w-full relative">
                <Bar data={hotsiteChartData} options={hotsiteChartOptions} />
              </div>
            </div>
          </div>

          {/* Table representing exactly the Hotsite spreadsheet */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-sans tracking-tight">Tabela de Desempenho do Hotsite</h3>
                <p className="text-xs text-slate-400 mt-1">Série compilada de tráfego por período de amostragem semanal</p>
              </div>
              <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200/50 font-mono font-bold">Hotsite Weekend</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                    <th className="px-6 py-4 font-bold text-[#0f172a] font-sans text-xs">Hotsite Weekend</th>
                    {HOTSITE_DATA.map(item => (
                      <th key={item.period} className="px-6 py-4 text-center">{item.period}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">Page Views</td>
                    {HOTSITE_DATA.map(item => {
                      // Blue highlight on 16 a 22 maio matching spreadsheet
                      const isHighlighted = item.period === '16 a 22 maio';
                      return (
                        <td 
                          key={item.period} 
                          className={cn(
                            "px-6 py-4 text-center font-mono font-semibold",
                            isHighlighted ? "text-indigo-600 bg-indigo-50/30 rounded" : "text-slate-600"
                          )}
                        >
                          {formatNum(item.pageViews)}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                    <td className="px-6 py-4 font-medium text-slate-700">Usuários</td>
                    {HOTSITE_DATA.map(item => {
                      // Blue highlight on 16 a 22 maio matching spreadsheet
                      const isHighlighted = item.period === '16 a 22 maio';
                      return (
                        <td 
                          key={item.period} 
                          className={cn(
                            "px-6 py-4 text-center font-mono font-semibold",
                            isHighlighted ? "text-indigo-600 bg-indigo-50/30 rounded" : "text-slate-600"
                          )}
                        >
                          {formatNum(item.users)}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface KPIItemProps {
  label: string;
  value: string | number;
  avg: string | number;
  icon: ReactNode;
  isPercentage?: boolean;
  benchmark?: string;
  tooltipText?: string;
  colorClass?: string;
}

function KPIItem({ label, value, avg, icon, isPercentage = false, benchmark, tooltipText, colorClass = "border-slate-800" }: KPIItemProps) {
  return (
    <div className={cn(
      "bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between border-t-4 transition-all hover:translate-y-[-2px] duration-200 cursor-default",
      colorClass
    )}>
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">{label}</p>
            <h4 className="text-2xl font-extrabold text-slate-900 mt-2 font-mono tracking-tight">
              {typeof value === 'number' ? formatNum(value) : value}
            </h4>
          </div>
          <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl shrink-0">
            {icon}
          </div>
        </div>
      </div>
      
      <div className="mt-4 border-t border-slate-50 pt-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 justify-between font-sans">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span>
              {isPercentage ? (
                <span className="text-slate-400 font-medium">Frequência: <span className="font-semibold text-slate-600 font-mono">{avg}</span></span>
              ) : (
                <>Média Semanal: <span className="font-semibold text-slate-600 font-mono">{typeof avg === 'number' ? formatNum(avg) : avg}</span></>
              )}
            </span>
          </div>
        </div>
        
        {benchmark && (
          <div className="mt-2.5 pt-2 border-t border-dashed border-slate-100 flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Ref. Mercado:</span>
            <div className="relative group/tooltip inline-block">
              <span className="font-bold text-amber-700 bg-amber-50 hover:bg-amber-100/90 transition-colors px-1.5 py-0.5 rounded cursor-help font-mono text-[10px] border border-amber-200/50">
                {benchmark}
              </span>
              {tooltipText && (
                <div className="absolute bottom-full right-0 mb-2 w-56 p-2.5 bg-slate-900 text-[10px] leading-relaxed text-slate-100 rounded-xl shadow-xl border border-slate-800 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-20 text-center font-sans tracking-normal font-normal">
                  {tooltipText}
                  <div className="w-2 h-2 bg-slate-900 rotate-45 absolute top-full right-4 -mt-1 border-r border-b border-slate-800"></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
