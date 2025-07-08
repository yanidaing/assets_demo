import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import AssetsTable from '../../components/AssetsTable';
import styles from '../../../styles/Home.module.css';
import React, { useState } from 'react';

const UserAssets: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className={styles.container}>
      <Head>
        <title>Assets - Mae Fah Luang University</title>
        <meta name="description" content="Asset Management Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      <main className={styles.mainContent}>
        <Navbar onSearch={setSearchTerm} />
        <AssetsTable searchTerm={searchTerm} />
      </main>
    </div>
  );
};

export default UserAssets; 