// Arquivo: src/pages/Dashboard/index.tsx
import React from 'react';
import styles from './styles.module.css';

export const Dashboard: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className={styles.header}>
        <h1 className={styles.title}>Visão Geral</h1>
        <p className={styles.subtitle}>Painel de controlo administrativo.</p>
      </div>

      {/* Área de Conteúdo Vazia (Placeholder) */}
      <div className={styles.emptyContainer}>
        <div className={styles.emptyContent}>
          <p>Área de Conteúdo Principal</p>
          <span className="text-sm opacity-70">Comece a adicionar os seus componentes aqui.</span>
        </div>
      </div>
    </div>
  );
};