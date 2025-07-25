// src/components/DashboardContent/DashboardChart.tsx
import React from 'react';
import dynamic from 'next/dynamic';
import styles from './DashboardContent.module.css';

// Dynamic import for ApexCharts to ensure it's client-side rendered
// This is crucial for libraries that rely on browser APIs
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DashboardChartProps {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  options: ApexCharts.ApexOptions;
  type?: 'bar' | 'pie';
  title?: string;
}

const DashboardChart: React.FC<DashboardChartProps> = ({ series, options, type = 'bar', title = 'Selling Reports' }) => {
  return (
    <div className={styles.chartCard}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <Chart options={options} series={series} type={type} height={350} />
    </div>
  );
};

export default DashboardChart;