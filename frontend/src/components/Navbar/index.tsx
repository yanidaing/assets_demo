// src/components/Navbar/index.tsx
import React from 'react';
import Image from 'next/image';
import { AiOutlineMenu, AiOutlineSearch, AiOutlineUser } from 'react-icons/ai';
import styles from './Navbar.module.css';

// *** ส่วนนี้สำคัญมาก: ต้องมี interface นี้อยู่ ***
interface NavbarProps {
  title?: string; // เพิ่ม prop title ที่นี่
}

// *** Component ต้องรับ props ตาม interface นี้ ***
const Navbar: React.FC<NavbarProps> = ({ title = 'Assets' }) => { // Default to 'Assets'
  return (
    <header className={styles.navbar}>
      <button className={styles.menuToggle}>
        <AiOutlineMenu />
      </button>
      <div className={styles.assetsTitle}>
        <h1>{title}</h1> {/* ใช้ title prop ตรงนี้ */}
      </div>
      <div className={styles.searchContainer}>
        <input type="text" placeholder="Search something here..." className={styles.searchInput} />
        <AiOutlineSearch className={styles.searchIcon} />
      </div>
      <div className={styles.userProfile}>
        <AiOutlineUser className={styles.userIcon} />
      </div>
    </header>
  );
};

export default Navbar;