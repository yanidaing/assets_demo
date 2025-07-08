// src/components/Navbar/index.tsx
import React from 'react';
import Image from 'next/image';
import { AiOutlineMenu, AiOutlineSearch, AiOutlineUser } from 'react-icons/ai';
import styles from './Navbar.module.css';
import { useRouter } from 'next/router';

// *** ส่วนนี้สำคัญมาก: ต้องมี interface นี้อยู่ ***
interface NavbarProps {
  title?: string; // เพิ่ม prop title ที่นี่
  onSearch?: (value: string) => void;
}

// *** Component ต้องรับ props ตาม interface นี้ ***
const Navbar: React.FC<NavbarProps> = ({ title = 'Assets', onSearch }) => { // Default to 'Assets'
  const [search, setSearch] = React.useState('');
  const [user, setUser] = React.useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    fetch('http://localhost:4000/api/auth/me', { credentials: 'include' })
      .then(async (res) => {
        if (res.ok) {
          const user = await res.json();
          setUser(user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('http://localhost:4000/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    router.replace('/login');
  };

  return (
    <header className={styles.navbar}>
      <button className={styles.menuToggle}>
        <AiOutlineMenu />
      </button>
      <div className={styles.assetsTitle}>
        <h1>{title}</h1> {/* ใช้ title prop ตรงนี้ */}
      </div>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search something here..."
          className={styles.searchInput}
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            if (onSearch) onSearch(e.target.value);
          }}
        />
        <AiOutlineSearch className={styles.searchIcon} />
      </div>
      <div className={styles.userProfile}>
        {user && user.profile_picture_url ? (
          <img
            src={user.profile_picture_url}
            alt="Profile"
            className={styles.userIcon}
            style={{ borderRadius: '50%', width: 36, height: 36, cursor: 'pointer' }}
            onClick={() => setDropdownOpen((open) => !open)}
          />
        ) : (
          <AiOutlineUser className={styles.userIcon} onClick={() => setDropdownOpen((open) => !open)} />
        )}
        {dropdownOpen && user && (
          <div className={styles.profileDropdown}>
            <div className={styles.profileInfo}>
              {user.profile_picture_url && (
                <img src={user.profile_picture_url} alt="Profile" style={{ borderRadius: '50%', width: 48, height: 48 }} />
              )}
              <div>
                <div><b>{user.full_name || user.email}</b></div>
                <div style={{ fontSize: 12, color: '#888' }}>{user.email}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{user.role}</div>
              </div>
            </div>
            <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;