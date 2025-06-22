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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ดึงข้อมูล dashboard จาก API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [summaryData, reportData] = await Promise.all([
          apiService.getAssetSummary(),
          apiService.getAssetReport()
        ]);
        setSummary(summaryData);
        setReport(reportData);
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
        type: 'line',
        toolbar: {
          show: false
        }
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        colors: ['#4f46e5']
      },
      xaxis: {
        categories: report?.sellingReports.map(r => r.month) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
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
        min: 12000,
        max: 20000,
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
        x: {
          show: true,
          format: 'MMM',
        },
        y: {
          formatter: function (value: number) {
            return value.toLocaleString() + ' Baht';
          },
        },
      }
    };
  };

  const getChartSeries = () => {
    return [{
      name: "Selling",
      data: report?.sellingReports.map(r => r.value) || [12500, 14000, 17500, 13800, 19500, 16800]
    }];
  };

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
      <DashboardChart series={getChartSeries()} options={getChartOptions()} />
    </div>
  );
};

export default DashboardContent;