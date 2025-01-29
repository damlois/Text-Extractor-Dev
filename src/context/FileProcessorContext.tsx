import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { User } from "../types";

interface FileProcessorContextProps {
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
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

  return (
    <FileProcessorContext.Provider
      value={{
        currentUser,
        setCurrentUser,
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
