import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import {
  User,
  Project,
  chatHistoryRecord,
  SessionType,
} from "../types";

interface FileProcessorContextProps {
  currentUser: User | null;
  currentProject: Project | null;
  projects: Project[];
  chatHistory: chatHistoryRecord[];
  sessionType: SessionType;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  setCurrentProject: Dispatch<SetStateAction<Project | null>>;
  setProjects: Dispatch<SetStateAction<Project[]>>;
  setChatHistory: Dispatch<SetStateAction<chatHistoryRecord[]>>;
  setSessionType: Dispatch<SetStateAction<SessionType>>;
}

interface FileProcessorProviderProps {
  children: ReactNode;
}

const FileProcessorContext = createContext<
  FileProcessorContextProps | undefined
>(undefined);

export const FileProcessorProvider: React.FC<FileProcessorProviderProps> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [chatHistory, setChatHistory] = useState<chatHistoryRecord[]>([]);
  const [sessionType, setSessionType] = useState<SessionType>("New");

  return (
    <FileProcessorContext.Provider
      value={{
        currentUser,
        currentProject,
        projects,
        chatHistory,
        sessionType,
        setCurrentUser,
        setCurrentProject,
        setProjects,
        setChatHistory,
        setSessionType,
      }}
    >
      {children}
    </FileProcessorContext.Provider>
  );
};

export const useFileProcessor = () => {
  const context = useContext(FileProcessorContext);
  if (!context) {
    throw new Error(
      "useFileProcessor must be used within a FileProcessorProvider"
    );
  }
  return context;
};
