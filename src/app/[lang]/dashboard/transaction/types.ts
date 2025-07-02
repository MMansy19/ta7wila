export interface Transactions {
  id: number;
  transaction_id?: string | number;
  ref_id?: string;
  store: string;
  from: string;
  mobile?: string;
  provider: string;
  payment_option?: string;
  amount: number;
  amount_exclude_fees?: number;
  platform_fees?: number;
  developer_fees?: number;
  total_fees?: number;
  state: string;
  status?: string;
  transaction: string;
  simNumber: string;
  userName: string;
  sender_name?: string;
  customer_name?: string;
  customer_phone?: string;
  date: string;
  transaction_date?: string;
  created_at?: string;
  updated_at?: string;
  developer_withdrawal_status?: string;
  platform_withdrawal_status?: string;
  application?: {
    id: number;
    name: string;
    logo?: string | null;
    email?: string;
  } | null;
  user?: {
    id: number;
    name: string;
  } | null;
}

export interface DetailedTransaction {
  id: number;
  transaction_id: string;
  ref_id: string;
  amount: number;
  amount_exclude_fees: number;
  platform_fees: number;
  developer_fees: number;
  total_fees: number;
  mobile: string;
  sender_name: string | null;
  transaction_date: string;
  status: string;
  developer_withdrawal_status: string;
  platform_withdrawal_status: string;
  payment_option: string;
  created_at: string;
  updated_at: string;
  application_id: number;
  customer_id: number | null;
  payment_option_id: number | null;
  user_id: number;
  user: {
    id: number;
    name: string;
  } | null;
  checkout_employees: any[];
  application: {
    id: number;
    name: string;
    logo: string | null;
    email: string;
  } | null;
}