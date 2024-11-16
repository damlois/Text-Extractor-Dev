export type Message = {
    text: string;
    from: "user" | "model" | "loader";
    image?: string;
  };