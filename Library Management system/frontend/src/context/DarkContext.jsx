import { createContext, useContext, useEffect, useState } from 'react';

const DarkContext = createContext();

export function DarkProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <DarkContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      {children}
    </DarkContext.Provider>
  );
}

export function useDark() { return useContext(DarkContext); }
