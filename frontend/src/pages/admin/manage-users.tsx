import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import styles from '../../../styles/Home.module.css';
import userTableStyles from '../../components/AssetsTable/AssetsTable.module.css';
import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingRoleId, setUpdatingRoleId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'admin' | 'user'>('All');

  useEffect(() => {
    apiService.getUsers()
      .then(setUsers)
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Manage Users - Admin</title>
        <meta name="description" content="Manage users" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar isAdmin />
      <main className={styles.mainContent}>
        <Navbar title="Manage Users" onSearch={setSearchTerm} />
        <section className={userTableStyles.assetsSection}>
          <div className={userTableStyles.assetsHeader}>
            <div>
              <p className={userTableStyles.totalAssets}>Total {users.length} users</p>
              <p className={userTableStyles.listOfEquipment}>List of account</p>
            </div>
            <div style={{ minWidth: 140, marginLeft: 8, position: 'relative' }}>
              <select
                className={userTableStyles.customDropdown}
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value as 'All' | 'admin' | 'user')}
                style={{
                  width: '100%',
                  padding: '0.8rem 1.2rem',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: 'var(--text-color-primary)',
                  border: '1px solid var(--border-color)',
                  background: '#fff',
                  outline: 'none',
                  cursor: 'pointer',
                  borderRadius: 8,
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'border 0.2s, box-shadow 0.2s',
                }}
              >
                <option value="All">All</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <div className={userTableStyles.assetsTableContainer}>
              <table className={userTableStyles.assetsTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(user => {
                    const search = searchTerm.trim().toLowerCase();
                    if (roleFilter !== 'All' && user.role !== roleFilter) return false;
                    if (!search) return true;
                    return (
                      (user.full_name && user.full_name.toLowerCase().includes(search)) ||
                      (user.first_name && user.first_name.toLowerCase().includes(search)) ||
                      (user.last_name && user.last_name.toLowerCase().includes(search)) ||
                      (user.email && user.email.toLowerCase().includes(search)) ||
                      (user.role && user.role.toLowerCase().includes(search))
                    );
                  }).map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>
                        {user.profile_picture_url ? (
                          <img src={user.profile_picture_url} alt={user.full_name || user.email} style={{ width: 48, height: 48, borderRadius: '50%' }} />
                        ) : (
                          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>-</div>
                        )}
                      </td>
                      <td>{user.full_name || user.first_name || user.last_name || '-'}</td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          value={user.role}
                          disabled={updatingRoleId === user.id}
                          onChange={async e => {
                            const newRole = e.target.value;
                            setUpdatingRoleId(user.id);
                            try {
                              await apiService.updateUserRole(user.id, newRole);
                              setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
                            } finally {
                              setUpdatingRoleId(null);
                            }
                          }}
                          style={{ padding: '0.4rem 0.7rem', borderRadius: 6, border: '1px solid #ccc', fontSize: '1rem', background: updatingRoleId === user.id ? '#f3f4f6' : undefined }}
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ManageUsers; 