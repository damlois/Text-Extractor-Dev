import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { User, Project, ChatMessage } from '../types';

interface FileProcessorContextProps {
  currentUser: User | null;
  currentProject: Project | null;
  projects: Project[];
  chatHistory: ChatMessage[];
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  setCurrentProject: Dispatch<SetStateAction<Project | null>>;
  setProjects: Dispatch<SetStateAction<Project[]>>;
  setChatHistory: Dispatch<SetStateAction<ChatMessage[]>>;
}

interface FileProcessorProviderProps {
  children: ReactNode;
}

const FileProcessorContext = createContext<FileProcessorContextProps | undefined>(undefined);

export const FileProcessorProvider: React.FC<FileProcessorProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  return (
    <FileProcessorContext.Provider
      value={{
        currentUser,
        currentProject,
        projects,
        chatHistory,
        setCurrentUser,
        setCurrentProject,
        setProjects,
        setChatHistory
      }}
    >
      {children}
    </FileProcessorContext.Provider>
  );
};

export const useFileProcessor = () => {
  const context = useContext(FileProcessorContext);
  if (!context) {
    throw new Error('useFileProcessor must be used within a FileProcessorProvider');
  }
  return context;
};
