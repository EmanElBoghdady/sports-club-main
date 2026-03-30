"use client";
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const TeamsLineChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June'],
    datasets: [
      {
        label: 'Football ',
        data: [78, 82, 85, 80, 88, 90],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Basketball ',
        data: [75, 78, 82, 85, 83, 87],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Handball',
        data: [70, 74, 78, 82, 85, 88],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.05)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b', font: { weight: 'bold', size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b', font: { weight: 'bold', size: 10 } }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: { weight: 'bold', size: 10 },
          usePointStyle: true,
          padding: 20
        }
      }
    }
  };

  return (
    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Performance Overview</h3>
      <h4 className="text-[10px] font-bold text-slate-600 mb-6 uppercase tracking-widest leading-none">Monthly performance by sport</h4>
      <div className="h-48">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default TeamsLineChart;