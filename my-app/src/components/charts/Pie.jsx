"use client";
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';


ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const TeamsPieChart = () => {
  const data = {
    labels: ['Football', 'Basketball', 'Handball '],
    datasets: [
      {
        data: [42, 33, 25],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#8B5CF6',
        ],
        borderColor: [
          '#2563EB',
          '#059669',
          '#7C3AED',
        ],
        borderWidth: 1,
        hoverOffset: 12
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#cbd5e1',
          padding: 15,
          font: {
            size: 10,
            weight: 'bold'
          },
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Team Distribution</h3>
      <h4 className="text-[10px] font-bold text-slate-600 mb-6 uppercase tracking-widest leading-none">Players across all sports</h4>
      <div className="h-46">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default TeamsPieChart;