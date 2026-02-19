// Arquivo: src/components/Layout/MainLayout/index.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';
import styles from './styles.module.css';

export const MainLayout: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      {/* Sidebar Fixa */}
      <Sidebar />
      
      {/* Área de Conteúdo (Header + Main Scrollável) */}
      <div className={styles.contentArea}>
        <Header />
        
        <main className={styles.main}>
          <div className={styles.pageContainer}>
            {/* O Outlet renderiza a página filha da rota atual */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};