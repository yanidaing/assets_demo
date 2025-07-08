// src/components/DashboardContent/index.tsx
import React, { useState, useEffect } from 'react';
import DashboardCards from './DashboardCards';
import DashboardChart from './DashboardChart';
import styles from './DashboardContent.module.css';
import { apiService, AssetSummary, AssetReport } from '../../services/api';

// *** เพิ่ม import สำหรับ ApexCharts.ApexOptions ที่นี่ ***
import type { ApexOptions } from 'apexcharts'; // ใช้ 'type' เพื่อให้ import เฉพาะ type ไม่ได้เอาโค้ดมาด้วย

const DashboardContent: React.FC = () => {
  const [summary, setSummary] = useState<AssetSummary | null>(null);
  const [report, setReport] = useState<AssetReport | null>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ดึงข้อมูล dashboard จาก API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [summaryData, reportData, assetsData] = await Promise.all([
          apiService.getAssetSummary(),
          apiService.getAssetReport(),
          apiService.getAssets(),
        ]);
        setSummary(summaryData);
        setReport(reportData);
        setAssets(assetsData);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Mock data for dashboard cards (ใช้เป็น fallback)
  const getCardData = () => {
    if (!summary) {
      return [
        { title: 'All property amount', value: 0, color: '#4f46e5', icon: 'X' },
        { title: 'Activated property amount', value: 0, color: '#22c55e', icon: 'X' },
        { title: 'Damaged property amount', value: 0, color: '#eab308', icon: 'X' },
        { title: 'Lost property amount', value: 0, color: '#ef4444', icon: 'X' },
      ];
    }

    return [
      { title: 'All property amount', value: summary.total, color: '#4f46e5', icon: 'X' },
      { title: 'Activated property amount', value: summary.statuses.Activated || 0, color: '#22c55e', icon: 'X' },
      { title: 'Damaged property amount', value: summary.statuses.Damaged || 0, color: '#eab308', icon: 'X' },
      { title: 'Lost property amount', value: summary.statuses.Lost || 0, color: '#ef4444', icon: 'X' },
    ];
  };

  // Mock data for the chart (Selling Reports)
  const getChartOptions = (): ApexOptions => {
    return {
      chart: {
        height: 350,
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '50%',
          distributed: true,
        }
      },
      fill: {
        opacity: 0.85,
        type: 'solid',
        colors: ['#4f46e5', '#22c55e', '#eab308', '#ef4444']
      },
      xaxis: {
        categories: ['All', 'Activated', 'Damaged', 'Lost'],
        labels: {
          style: {
            colors: '#666',
          }
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          formatter: function (value: number) {
            return value.toLocaleString();
          },
          style: {
            colors: '#666',
          }
        },
        min: 0,
        tickAmount: 4,
      },
      grid: {
        borderColor: '#f0f0f0',
        strokeDashArray: 4,
        position: 'back',
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: function (value: number) {
            return value.toLocaleString();
          },
        },
      }
    };
  };

  const getChartSeries = () => {
    if (!summary) {
      return [{ name: 'Property Amount', data: [0, 0, 0, 0] }];
    }
    return [{
      name: 'Property Amount',
      data: [
        summary.total,
        summary.statuses.Activated || 0,
        summary.statuses.Damaged || 0,
        summary.statuses.Lost || 0,
      ]
    }];
  };

  const barColors = [
    '#4f46e5', '#22c55e', '#eab308', '#ef4444', '#06b6d4', '#f59e42', '#a21caf', '#f43f5e', '#10b981', '#fbbf24', '#6366f1', '#f87171'
  ];

  // สร้างข้อมูลนับจำนวน asset ต่อเดือน
  const monthCount: Record<string, number> = {};
  assets.forEach(asset => {
    if (asset.Date) {
      const d = new Date(asset.Date);
      if (!isNaN(d.getTime())) {
        const label = `${d.toLocaleString('en-US', { month: 'short' })} ${d.getFullYear()}`;
        monthCount[label] = (monthCount[label] || 0) + 1;
      }
    }
  });
  const monthLabels = Object.keys(monthCount).sort((a, b) => {
    const [ma, ya] = a.split(' ');
    const [mb, yb] = b.split(' ');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return parseInt(ya) - parseInt(yb) || months.indexOf(ma) - months.indexOf(mb);
  });
  const monthData = monthLabels.map(label => monthCount[label]);

  const getMonthPieOptions = (): ApexOptions => {
    return {
      chart: {
        type: 'pie',
        height: 350,
        toolbar: { show: false },
      },
      labels: monthLabels,
      colors: monthLabels.map((_, i) => barColors[i % barColors.length]),
      legend: {
        position: 'bottom',
        labels: { colors: '#666' },
      },
      tooltip: {
        enabled: true,
        y: { formatter: (value: number) => value.toLocaleString() },
      },
    };
  };

  const getMonthPieSeries = () => monthData;

  if (loading) {
    return (
      <div className={styles.dashboardContent}>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboardContent}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContent}>
      <DashboardCards cards={getCardData()} />
      <DashboardChart series={getChartSeries()} options={getChartOptions()} type="bar" title="Property Amount" />
    </div>
  );
};

export default DashboardContent;