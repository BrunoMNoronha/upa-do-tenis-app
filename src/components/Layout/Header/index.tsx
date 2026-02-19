import React from 'react';
import { Bell, Search } from 'lucide-react';
import { WindowControls } from '../WindowControls'; // Componente nativo (veja passo 4)
import styles from './styles.module.css';

export const Header: React.FC = () => {
  return (
    // data-tauri-drag-region permite arrastar a janela clicando no header
    <header className={styles.headerContainer} data-tauri-drag-region>
      
      {/* Área de Pesquisa */}
      <div className="flex items-center gap-2 text-slate-400 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 w-64">
        <Search size={18} />
        <span className="text-sm">Pesquisar...</span>
      </div>

      {/* Ações + Controles de Janela */}
      <div className="flex items-center">
        <div className="flex items-center gap-4 mr-6">
            <Bell className="text-slate-500 cursor-pointer" size={20} />
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
            JD
            </div>
        </div>
        
        {/* Controles Nativos do Tauri */}
        <WindowControls />
      </div>
    </header>
  );
};