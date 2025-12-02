import type { UserSession } from "./index";
import type { FocusEventHandler } from "react";

export interface HeaderProps {
  user?: UserSession | null;
}

export interface OtpInputProps {
  numInputs?: number;
  // for generic controlled component
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  error?: string | null;
  // for formik integration
  name?: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
