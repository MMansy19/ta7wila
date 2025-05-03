import { ReactNode } from "react";

export interface Verifications {
  id: number;
  front_photo: string;
  back_photo: string;
  selfie_photo: string;
  rejected_notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  rejected_reason_id: number | null;
  user: {
    id: number;
    email: string;
    mobile: string;
    name: string;
    username: string;
  };
  rejected_reason: {
    id: number;
    value: string;
    status: string;
    rejected_reason_type: string;
    created_at: string;
    updated_at: string;
  } | null;
}


export interface DetailItemProps {
  label: string;
  value?: string | number | null;
  children?: ReactNode;
};

export interface PhotoPreviewProps {
  label: string;
  src: string;
};

export interface ActionButtonProps  {
  color: "green" | "red";
  children: ReactNode;
  onClick?: () => void;
};

export interface Rejectedreasons {
  id: number;
  value: string;
  status: string;
  rejected_reason_type: string;
  created_at: string | null;
  updated_at: string | null;
};

  