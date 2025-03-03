import * as Yup from "yup";

export const createUserSchema = Yup.object({
  first_name: Yup.string()
    .trim()
    .min(1, "Please, enter a valid first name")
    .required("First name is required"),
  last_name: Yup.string()
    .trim()
    .min(1, "Please enter a valid last name")
    .required("Last name is required"),
  email: Yup.string()
    .trim()
    .email("Please input a valid email address")
    .required("Email is required"),
  role: Yup.string().trim().required("Role is required"),
});
