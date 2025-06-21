// src/pages/dashboard.tsx
import Head from 'next/head';
import Sidebar from '../components/Sidebar'; // Path นี้จะขึ้นอยู่กับว่า components อยู่ใน src หรือไม่
import Navbar from '../components/Navbar';   // Path นี้จะขึ้นอยู่กับว่า components อยู่ใน src หรือไม่
import DashboardContent from '../components/DashboardContent'; // Path ใหม่
import styles from '../../styles/Home.module.css'; // Path นี้ต้องถูกต้องตามโครงสร้างที่คุณมี

const DashboardPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Dashboard - Mae Fah Luang University</title>
        <meta name="description" content="Dashboard for Asset Management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      <main className={styles.mainContent}>
      <Navbar title="Dashboard" />
        <DashboardContent />
      </main>
    </div>
  );
};

export default DashboardPage;