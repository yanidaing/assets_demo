import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AiFillHome, AiOutlineBarChart, AiOutlineFileText, AiOutlineUser, AiOutlineSetting } from 'react-icons/ai';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <Image
          src="/mfu-logo.png" // ต้องมีไฟล์นี้ใน public/
          alt="Mae Fah Luang University Logo"
          width={40}
          height={40}
          className={styles.logo}
        />
        <span className={styles.universityName}>Mae Fah Luang University</span>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li className={styles.navItem}>
            <Link href="/" className={styles.navLink + ' ' + styles.active}>
                <AiFillHome className={styles.icon} />
                <span>Assets</span>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/dashboard" className={styles.navLink}>
                <AiOutlineBarChart className={styles.icon} />
                <span>Dashboard</span>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/reports" className={styles.navLink}>
                <AiOutlineFileText className={styles.icon} />
                <span>Reports</span>
            </Link>
          </li>
          {isAdmin && (
            <>
              <li className={styles.navItem}>
                <Link href="/admin/manage-users" className={styles.navLink}>
                  <AiOutlineUser className={styles.icon} />
                  <span>Manage Users</span>
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/admin/settings" className={styles.navLink}>
                  <AiOutlineSetting className={styles.icon} />
                  <span>Settings</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;