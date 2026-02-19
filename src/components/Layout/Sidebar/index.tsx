import React from 'react';
import { Home, Settings, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import styles from './styles.module.css';

export const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.logoArea}>
        <span className="font-bold text-xl">DashCore</span>
      </div>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          end
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <Home size={20} />
          <span className="font-medium text-sm">Dashboard</span>
        </NavLink>

        <NavLink
          to="/usuarios"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
        >
          <Users size={20} />
          <span className="font-medium text-sm">Usuários</span>
        </NavLink>

        <div className={styles.navItem}>
          <Settings size={20} />
          <span className="font-medium text-sm">Configurações</span>
        </div>
      </nav>
    </aside>
  );
};
