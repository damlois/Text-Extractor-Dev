import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Project, ChatSession, ChatMessage } from '../types';

interface FileProcessorContextProps {
  currentUser: User | null;
  projects: Project[];
  chatSessions: ChatSession[];
  chatMessages: ChatMessage[];
  setCurrentUser: (user: User) => void;
  setProjects: (projects: Project[]) => void;
  setChatSessions: (sessions: ChatSession[]) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
}

interface FileProcessorProviderProps {
  children: ReactNode;
}

const FileProcessorContext = createContext<FileProcessorContextProps | undefined>(undefined);

export const FileProcessorProvider: React.FC<FileProcessorProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  return (
    <FileProcessorContext.Provider value={{ currentUser, projects, chatSessions, chatMessages, setCurrentUser, setProjects, setChatSessions, setChatMessages }}>
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
