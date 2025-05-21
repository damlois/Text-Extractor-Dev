export type RoleModalType = "create_role" | "edit_role" | "confirm_delete";
export type RoleModalConfig = {
  type: RoleModalType;
  open: boolean;
};
