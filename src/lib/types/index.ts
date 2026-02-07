enum MsgCategory {
  Error,
}

export enum MsgType {
  reset = "reset",
}

export type UserSession = {
  name: string;
  email: string;
  role: UserRole;
};

export enum UserRole {
  shopper = "shopper",
  vendor = "vendor",
  chef = "chef",
}

export * from "./auth";
export * from "./ui";
export * from "./entities";
export * from "./graphql";
export * from "./profile";
