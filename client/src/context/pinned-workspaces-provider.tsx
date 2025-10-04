import React, { createContext, useContext, useState, useEffect } from 'react';

interface PinnedWorkspacesContextType {
  pinnedWorkspaces: string[];
  togglePin: (workspaceId: string) => void;
  isPinned: (workspaceId: string) => boolean;
}

const PinnedWorkspacesContext = createContext<PinnedWorkspacesContextType | undefined>(undefined);

export const PinnedWorkspacesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pinnedWorkspaces, setPinnedWorkspaces] = useState<string[]>([]);

  // Загружаем закрепленные workspace'ы из sessionStorage при монтировании
  useEffect(() => {
    const savedPinned = sessionStorage.getItem('pinned-workspaces');
    if (savedPinned) {
      try {
        setPinnedWorkspaces(JSON.parse(savedPinned));
      } catch {
        setPinnedWorkspaces([]);
      }
    }
  }, []);

  // Сохраняем закрепленные workspace'ы в sessionStorage при изменении
  useEffect(() => {
    sessionStorage.setItem('pinned-workspaces', JSON.stringify(pinnedWorkspaces));
  }, [pinnedWorkspaces]);

  const togglePin = (workspaceId: string) => {
    setPinnedWorkspaces(prev => {
      if (prev.includes(workspaceId)) {
        return prev.filter(id => id !== workspaceId);
      } else {
        return [...prev, workspaceId];
      }
    });
  };

  const isPinned = (workspaceId: string) => {
    return pinnedWorkspaces.includes(workspaceId);
  };

  return (
    <PinnedWorkspacesContext.Provider
      value={{
        pinnedWorkspaces,
        togglePin,
        isPinned,
      }}
    >
      {children}
    </PinnedWorkspacesContext.Provider>
  );
};

export const usePinnedWorkspaces = () => {
  const context = useContext(PinnedWorkspacesContext);
  if (!context) {
    throw new Error('usePinnedWorkspaces must be used within a PinnedWorkspacesProvider');
  }
  return context;
};
