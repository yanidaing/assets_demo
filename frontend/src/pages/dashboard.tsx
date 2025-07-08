// src/pages/dashboard.tsx
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import DashboardContent from '../components/DashboardContent';
import styles from '../../styles/Home.module.css';
import React, { useEffect, useState } from 'react';

const DashboardPage: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/api/auth/me', { credentials: 'include' })
      .then(async (res) => {
        if (res.ok) {
          const user = await res.json();
          setIsAdmin(user.role === 'admin');
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Dashboard - Mae Fah Luang University</title>
        <meta name="description" content="Dashboard for Asset Management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar isAdmin={isAdmin} />

      <main className={styles.mainContent}>
        <Navbar title="Dashboard" />
        <DashboardContent />
      </main>
    </div>
  );
};

export default DashboardPage;