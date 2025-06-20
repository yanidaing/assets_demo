import React from 'react';
import Image from 'next/image';
import { AiOutlineMenu, AiOutlineSearch, AiOutlineUser } from 'react-icons/ai';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <header className={styles.navbar}>
      <button className={styles.menuToggle}>
        <AiOutlineMenu />
      </button>
      <div className={styles.assetsTitle}>
        
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