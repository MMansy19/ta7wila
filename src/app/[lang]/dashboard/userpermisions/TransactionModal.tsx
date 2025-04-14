import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";
import { PaymentData, PaymentOption } from "./types";


export default function TransactionModal({
  isOpen,
  onClose,
  paymentData,
  stores,
  paymentOptions,
  refreshData,
  currentPage,
}: {
  isOpen: boolean;
  onClose: () => void;
  paymentData: PaymentData | null;
  stores: any[];
  paymentOptions: PaymentOption[];
  refreshData: () => void;
  currentPage: number;
}) {
  const [showSecondForm, setShowSecondForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!isOpen) return null;

  return (
<>
</>
  );
}