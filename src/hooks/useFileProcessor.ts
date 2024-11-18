import { useState, useEffect } from "react";
import { fileProcessorApi } from "../api/api";
import { useFileProcessor } from "../context/FileProcessorContext";
import { Project, ChatSession, ChatMessage, Instruction } from "../types";

export const useCurrentUser = () => {
  const { setCurrentUser } = useFileProcessor();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fileProcessorApi.getCurrentUser().then((res) => {
      setCurrentUser(res.data);
      setLoading(false);
    });
  }, [setCurrentUser]);

  return { loading };
};

export const useProjects = () => {
  const { setProjects } = useFileProcessor();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fileProcessorApi.getProjects().then((res) => {
      setProjects(res.data);
      setLoading(false);
    });
  }, [setProjects]);

  return { loading };
};

export const useCreateProject = () => {
  const { setProjects, setCurrentProject } = useFileProcessor();

  const createProject = async (data: {
    name: string;
    description?: string;
  }) => {
    const response = await fileProcessorApi.createProject(data);
    setCurrentProject(response.data);
    setProjects((prevProjects) => [...prevProjects, response.data]);
    return response.data;
  };

  return { createProject };
};

export const useUploadFiles = () => {
  const { currentProject, setProjects } = useFileProcessor();

  const uploadFiles = async (files: File[]) => {
    if (!currentProject) throw new Error("No project selected");

    const fileList = new DataTransfer();
    files.forEach((file) => fileList.items.add(file));

    const response = await fileProcessorApi.uploadFiles(
      currentProject.id,
      fileList.files
    );
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === currentProject.id
          ? { ...project, files_data: response.data }
          : project
      )
    );
    return response.data;
  };

  return { uploadFiles };
};

export const useAnalyzeFiles = () => {
  const { currentProject, setProjects } = useFileProcessor();

  const analyzeFiles = async (instructions: Instruction[]) => {
    if (!currentProject) throw new Error("No project selected");

    // const response = await fileProcessorApi.analyzeFiles(
    //   currentProject.id,
    //   instructions
    // );

    const response = {
      data: {
        id: 22,
        name: "Project",
        description: "",
        created_at: "2024-11-18T16:34:10.574793",
        files_data: {
          message: "Files processed successfully",
          files: [
            {
              id: 26,
              file_name: "Resume.pdf",
              content:
                "# Lois Adegbohungbe\n\n## Fullstack Software Developer\n\nloisadegbohungbe@gmail.com loisadegbohungbe@gmail.com [+2348100452087](https://www.linkedin.com/in/adegbohungbe-lois/)\n\n3+ years experience in building scalable web applications with solid problem-solving, attention to\ndetail, and collaboration skills. Quick adaptation to new technologies.\n\n### Designed a fully functional frontend for the healthcare system, adequately validating all forms with a React Module called Formik and ensuring seamless navigation with React Router between all website pages.\n\n\n**Dufuna Technologies, Remote - Fullstack Engineer**\n\nLinkedIn/lois   Github/lois\n\n\n_Dufuna Technologies, Remote - Fullstack Engineer_\n\n\n3+ years ex perien ce in build ing scala ble web application s with s olid proble m-solving, atte ntion\nto detail, and collaboration skills. Quick adaptation to new technologies.\n\nCollaborated with team members to ensure clean and high-quality code using SonarQube and\ndetailed code reviews.\n\n**AUG 2021 - Present** _Utilized the Keycloak Identity and Access Management system to implement a smooth onboarding API for a telemedicine app where patients consult doctors online._\n\nBachelor o f Science, Computer Engineer ing\n\nLeveraged Google Analytics to improve customer tracking.\nJavascript\n\n**ReactJS, NextJS** _Typescript_\n\nChackraUI, TailwindCSS\n\nMongoDB, Postgre SQL\n\n### Education\n\n\n**Integrated an API to send access codes by push notifications to a security management system for gated homes.**\n\nSingle-handedly discovered technical bugs in the codebase and fixed them thereby improving workflow processes.\n\n### Skills\n\nCollaborated with team members to ensure clean and high-quality code using SonarQube and detailed code reviews.\nReactJS, NextJS\nAfrilearn, Lagos, Nigeria - Fullstack Engineer\n\n\n_MAY 2015 - JAN 2020_\n\nLeveraged Google Analytics to improve customer tracking.\nEnhanced the existing frontend of the learning platform which increased customer engagement and retention by 20%.\nInnovantics, Lagos, Nigeria - Backend Engineering intern\n\n\n-----\n\n",
              status: "completed",
            },
          ],
        },
        analysis_data: {
          id: 3,
          instructions: [
            {
              title: "Name",
              description: "name",
              data_type: "text",
            },
            {
              title: "Skills",
              description: "skills",
              data_type: "text",
            },
          ],
          results: {
            per_document: {
              "Resume.pdf": {
                Name: {
                  value: "Lois Adegbohungbe",
                  confidence: "high",
                  source: "Resume.pdf",
                },
                Skills: {
                  value: [
                    "ReactJS, NextJS",
                    "Afrilearn, Lagos, Nigeria - Fullstack Engineer",
                    "Leveraged Google Analytics to improve customer tracking.",
                    "Enhanced the existing frontend of the learning platform which increased customer engagement and retention by 20%.",
                  ],
                  confidence: "medium",
                  source: "Resume.pdf",
                },
              },
            },
            combined: {
              Name: {
                values: [
                  {
                    document: "Resume.pdf",
                    value: "Lois Adegbohungbe",
                    confidence: "high",
                    source: "Resume.pdf",
                  },
                ],
                summary: {
                  total_documents: 1,
                  documents_with_value: 1,
                },
              },
              Skills: {
                values: [
                  {
                    document: "Resume.pdf",
                    value: [
                      "ReactJS, NextJS",
                      "Afrilearn, Lagos, Nigeria - Fullstack Engineer",
                      "Leveraged Google Analytics to improve customer tracking.",
                      "Enhanced the existing frontend of the learning platform which increased customer engagement and retention by 20%.",
                    ],
                    confidence: "medium",
                    source: "Resume.pdf",
                  },
                ],
                summary: {
                  total_documents: 1,
                  documents_with_value: 1,
                },
              },
            },
          },
          created_at: "2024-11-18T16:43:22.407997",
        },
      },
    };

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === currentProject.id
          ? { ...project, analysis_data: response.data.analysis_data }
          : project
      )
    );

    return response.data;
  };

  return { analyzeFiles };
};

export const useChatSessions = (type?: "document" | "image") => {
  const { currentProject, setChatSessions } = useFileProcessor();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentProject) return;

    // fileProcessorApi.getChatSessions(currentProject.id, type).then(res => {
    //   setChatSessions(res.data);
    //   setLoading(false);
    // });
  }, [currentProject, type, setChatSessions]);

  return { loading };
};

export const useCreateChatSession = () => {
  const { currentProject, setChatSessions } = useFileProcessor();

  const createChatSession = async (data: {
    name?: string;
    file_ids: number[];
    session_type: "document" | "image";
  }) => {
    if (!currentProject) throw new Error("No project selected");

    // const response = await fileProcessorApi.createChatSession(currentProject.id, data);
    // setChatSessions(prevSessions => [...prevSessions, response.data]);
    // return response.data;
  };

  return { createChatSession };
};

export const useChatMessages = (sessionId: number) => {
  const { setChatMessages } = useFileProcessor();
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fileProcessorApi.getChatMessages(sessionId).then(res => {
  //     setChatMessages(res.data.messages);
  //     setLoading(false);
  //   });
  // }, [sessionId, setChatMessages]);

  return { loading };
};

export const useSendMessage = (sessionId: number) => {
  const { setChatMessages } = useFileProcessor();

  // const sendMessage = async (data: { content: string; additional_data?: Record<string, any> }) => {
  //   const response = await fileProcessorApi.sendMessage(sessionId, data);
  //   setChatMessages((prevMessages: ChatMessage[]) => [...prevMessages, response.data as unknown as ChatMessage]);
  //   return response.data;
  // };

  // return { sendMessage };
};
