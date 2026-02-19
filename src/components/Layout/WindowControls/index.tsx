import React, { useEffect, useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Minus, Square, X, Copy } from 'lucide-react'; // Copy usado como ícone de 'restore'
import styles from './styles.module.css';

export const WindowControls: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  // Verifica estado inicial e ouve mudanças
  useEffect(() => {
    const checkMaximized = async () => {
        const appWindow = getCurrentWindow();
        setIsMaximized(await appWindow.isMaximized());
    };
    checkMaximized();

    // Listener opcional para redimensionamento poderia ser adicionado aqui
  }, []);

  const handleMinimize = () => getCurrentWindow().minimize();
  
  const handleToggleMaximize = async () => {
    const appWindow = getCurrentWindow();
    await appWindow.toggleMaximize();
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => getCurrentWindow().close();

  return (
    <div className={styles.controlsContainer}>
      <button onClick={handleMinimize} className={styles.controlBtn} title="Minimizar">
        <Minus size={18} />
      </button>
      <button onClick={handleToggleMaximize} className={styles.controlBtn} title="Maximizar">
        {isMaximized ? <Copy size={16} /> : <Square size={16} />}
      </button>
      <button onClick={handleClose} className={styles.closeBtn} title="Fechar">
        <X size={18} />
      </button>
    </div>
  );
};