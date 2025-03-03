import * as Yup from "yup";

export const setPasswordSchema = Yup.object({
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
  password: Yup.string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[\W_]/, "Must contain at least one special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .trim()
    .oneOf(
      [Yup.ref("password")],
      "Password and Confirm Password should be the same"
    )
    .required("Please confirm your password"),
});
