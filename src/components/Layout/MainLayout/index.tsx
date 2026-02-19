import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import styles from './styles.module.css';

export const MainLayout: React.FC = () => {
  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.sidebarWrapper}>
        <Sidebar />
      </div>

      <div className={styles.contentWrapper}>
        <Header />

        <main className={styles.mainContent}>
          <div className={styles.contentContainer}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
