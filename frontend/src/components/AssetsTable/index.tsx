import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AiOutlineCalendar, AiOutlineFilter, AiOutlineDown, AiOutlineEllipsis } from 'react-icons/ai';
import styles from './AssetsTable.module.css';
import Pagination from '../Pagination';
import { apiService, Asset } from '../../services/api';
import { formatDate } from '../../lib/dateUtils';

const AssetsTable: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  // ดึงข้อมูล assets จาก API
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const data = await apiService.getAssets();
        setAssets(data);
        setError(null);
      } catch (err) {
        setError('Failed to load assets');
        console.error('Error fetching assets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const filteredAssets = activeFilter === 'All'
    ? assets
    : assets.filter(asset => asset.status === activeFilter);

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const currentAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusClass = (status: Asset['status']) => {
    switch (status) {
      case 'Activated': return styles.statusActivated;
      case 'Lost': return styles.statusLost;
      case 'Damaged': return styles.statusDamaged;
      default: return '';
    }
  };

  if (loading) {
    return (
      <section className={styles.assetsSection}>
        <div className={styles.assetsHeader}>
          <div>
            <h2>Assets</h2>
            <p>Loading assets...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.assetsSection}>
        <div className={styles.assetsHeader}>
          <div>
            <h2>Assets</h2>
            <p style={{ color: 'red' }}>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.assetsSection}>
      <div className={styles.assetsHeader}>
        <div>
          
          <p className={styles.totalAssets}>Total {assets.length} assets</p>
          <p className={styles.listOfEquipment}>List of equipment</p>
        </div>
      </div>

      <div className={styles.assetsControls}>
        <div className={styles.statusFilters}>
          {['All', 'Activated', 'Lost', 'Damaged'].map(status => (
            <button
              key={status}
              className={`${styles.filterButton} ${activeFilter === status ? styles.active : ''}`}
              onClick={() => {
                setActiveFilter(status as Asset['status'] | 'All');
                setCurrentPage(1);
              }}
            >
              {status}
            </button>
          ))}
        </div>
        <div className={styles.rightControls}>
          <button className={styles.iconButton}>
            <AiOutlineCalendar />
          </button>
          <button className={styles.filterDropdown}>
            Filter <AiOutlineDown className={styles.dropdownIcon} />
          </button>
        </div>
      </div>

      <div className={styles.assetsTableContainer}>
        <table className={styles.assetsTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Location</th>
              <th>Agency</th>
              <th>Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentAssets.map(asset => (
              <tr key={asset.id}>
                <td>{asset.id}</td>
                <td>
                  <Image
                    src={asset.image || '/mfu-logo.png'} // ใช้รูป default ถ้าไม่มีรูป
                    alt={asset.name}
                    width={60}
                    height={60}
                    className={styles.assetImage}
                  />
                </td>
                <td>{asset.name}</td>
                <td>{asset.description}</td>
                <td>{asset.Location}</td>
                <td>{asset.Agency}</td>
                <td>{formatDate(asset.Date)}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusClass(asset.status)}`}>
                    {asset.status}
                  </span>
                </td>
                <td>
                  <button className={styles.ellipsisButton}>
                    <AiOutlineEllipsis />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
};

export default AssetsTable;