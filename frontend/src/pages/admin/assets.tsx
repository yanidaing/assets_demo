import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import AssetsTable from '../../components/AssetsTable';
import styles from '../../../styles/Home.module.css';
import React, { useState } from 'react';
import { AiOutlineBarcode } from 'react-icons/ai';
import dynamic from 'next/dynamic';
const BarcodeScannerModal = dynamic(() => import('../../components/BarcodeScannerModal'), { ssr: false });

const AdminAssets: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);

  return (
    <div className={styles.container}>
      <Head>
        <title>Assets - Mae Fah Luang University</title>
        <meta name="description" content="Asset Management Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar isAdmin />

      <main className={styles.mainContent}>
        <Navbar title="Admin Dashboard" onSearch={setSearchTerm} />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <button
            className={styles.calendarButton}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => setShowScanner(true)}
          >
            <AiOutlineBarcode size={20} />
            Scan Barcode
          </button>
        </div>
        <AssetsTable searchTerm={searchTerm} isAdmin selectedBarcode={scannedBarcode} />
        {showScanner && (
          <BarcodeScannerModal
            onClose={() => setShowScanner(false)}
            onDetected={barcode => {
              setShowScanner(false);
              setScannedBarcode(barcode);
              setSearchTerm(barcode);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default AdminAssets; 