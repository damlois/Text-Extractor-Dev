import { Application } from "../types";

const encode = (str: string) => btoa(str);
const decode = (str: string) => atob(str) as Application;

export const setAppTypeInStorage = (value: Application) => {
  localStorage.setItem("currentApp", encode(value));
};

export const getAppTypeFromStorage = () => {
  try {
    const stored = localStorage.getItem("currentApp");
    return stored ? decode(stored) : "INVOICE";
  } catch {
    return "INVOICE";
  }
};
