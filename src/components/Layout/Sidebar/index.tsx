import React from 'react';
import { Home, Users, Settings } from 'lucide-react';
import styles from './styles.module.css';

export const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.logoArea}>
        <span className="font-bold text-xl">DashCore</span>
      </div>
      <nav className={styles.nav}>
        <div className={`${styles.navItem} ${styles.navItemActive}`}>
          <Home size={20} />
          <span className="font-medium text-sm">Dashboard</span>
        </div>
        <div className={styles.navItem}>
          <Users size={20} />
          <span className="font-medium text-sm">Equipe</span>
        </div>
        <div className={styles.navItem}>
          <Settings size={20} />
          <span className="font-medium text-sm">Configurações</span>
        </div>
      </nav>
    </aside>
  );
};