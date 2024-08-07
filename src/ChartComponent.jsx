import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function ChartComponent({ chartData, chartType }) {
  return (
    <div>
      {chartType === 'bar' ? (
        <Bar data={chartData} options={{ plugins: { legend: { display: true } } }} />
      ) : (
        <Pie data={chartData} options={{ plugins: { legend: { display: true } } }} />
      )}
    </div>
  );
}
