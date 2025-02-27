export type ModalType = "create_user" | "update_status" | "update_successful";
export type ModalConfig = {
  type: ModalType;
  open: boolean;
};
