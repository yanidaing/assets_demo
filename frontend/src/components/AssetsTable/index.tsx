import React, { useState } from 'react';
import Image from 'next/image';
import { AiOutlineCalendar, AiOutlineFilter, AiOutlineDown, AiOutlineEllipsis } from 'react-icons/ai';
import styles from './AssetsTable.module.css';
import Pagination from '../Pagination';

interface Asset {
  id: string;
  image: string;
  name: string;
  location: string;
  agency: string;
  date: string;
  status: 'Activated' | 'Lost' | 'Damaged';
}

const mockAssets: Asset[] = [
  { id: '01', image: '/eggs.png', name: 'Eggs', location: 'D1', agency: 'Mae Fah Luang University', date: '11 Mar 2021\n9:37 AM', status: 'Activated' },
  { id: '02', image: '/eggs.png', name: 'Eggs', location: 'D1', agency: 'Mae Fah Luang University', date: '11 Mar 2021\n9:37 AM', status: 'Lost' },
  { id: '03', image: '/eggs.png', name: 'Eggs', location: 'D1', agency: 'Mae Fah Luang University', date: '11 Mar 2021\n9:37 AM', status: 'Damaged' },
  { id: '04', image: '/eggs.png', name: 'Eggs', location: 'D1', agency: 'Mae Fah Luang University', date: '11 Mar 2021\n9:37 AM', status: 'Activated' },
  { id: '05', image: '/eggs.png', name: 'Eggs', location: 'D1', agency: 'Mae Fah Luang University', date: '11 Mar 2021\n9:37 AM', status: 'Activated' },
  { id: '06', image: '/eggs.png', name: 'Eggs', location: 'D1', agency: 'Mae Fah Luang University', date: '11 Mar 2021\n9:37 AM', status: 'Lost' },
  { id: '07', image: '/eggs.png', name: 'Eggs', location: 'D1', agency: 'Mae Fah Luang University', date: '11 Mar 2021\n9:37 AM', status: 'Damaged' },
  { id: '08', image: '/eggs.png', name: 'Eggs', location: 'D1', agency: 'Mae Fah Luang University', date: '11 Mar 2021\n9:37 AM', status: 'Activated' },
];

const AssetsTable: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4; // Display 4 items per page as per image

  const filteredAssets = activeFilter === 'All'
    ? mockAssets
    : mockAssets.filter(asset => asset.status === activeFilter);

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

  return (
    <section className={styles.assetsSection}>
      <div className={styles.assetsHeader}>
        <div>
          <h2>Assets</h2>
          <p className={styles.totalAssets}>Total {mockAssets.length} assets</p>
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
                setCurrentPage(1); // Reset page on filter change
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
                    src={asset.image}
                    alt={asset.name}
                    width={60}
                    height={60}
                    className={styles.assetImage}
                  />
                </td>
                <td>{asset.name}</td>
                <td>{asset.location}</td>
                <td>{asset.agency}</td>
                <td>{asset.date.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i === 0 && <br />}
                  </React.Fragment>
                ))}</td>
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};

export default AssetsTable;