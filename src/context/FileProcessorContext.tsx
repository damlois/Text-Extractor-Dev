import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { User, Project, ChatSession, ChatMessage } from '../types';

interface FileProcessorContextProps {
  currentUser: User | null;
  currentProject: Project | null;
  projects: Project[];
  chatSessions: ChatSession[];
  chatMessages: ChatMessage[];
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  setCurrentProject: Dispatch<SetStateAction<Project | null>>;
  setProjects: Dispatch<SetStateAction<Project[]>>;
  setChatSessions: Dispatch<SetStateAction<ChatSession[]>>;
  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}

interface FileProcessorProviderProps {
  children: ReactNode;
}

const FileProcessorContext = createContext<FileProcessorContextProps | undefined>(undefined);

export const FileProcessorProvider: React.FC<FileProcessorProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  return (
    <FileProcessorContext.Provider
      value={{
        currentUser,
        currentProject,
        projects,
        chatSessions,
        chatMessages,
        setCurrentUser,
        setCurrentProject,
        setProjects,
        setChatSessions,
        setChatMessages
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
