export interface Params {
  id: string;
}

export interface Transaction {
  id: string;
  transaction_id: string;
  ref_id: string;
  amount: number;
  amount_exclude_fees: number;
  platform_fees: number;
  developer_fees: number;
  total_fees: number;
  mobile: string;
  sender_name: string | null;
  developer_withdrawal_status: 'pending' | 'completed';
  platform_withdrawal_status: 'pending' | 'completed';
  status: 'completed' | 'pending';
  payment_option: string;
  transaction_date: string;
  transaction_fee: number;
  net_amount: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  title: string;
  subtitle: string;
  amount: number;
  subscription_type: 'monthly' | 'yearly';
  status: 'active' | 'inactive';
  applications_count: number;
  max_applications_count: number;
  employees_count: number;
  max_employees_count: number;
  vendors_count: number;
  max_vendors_count: number;
  created_at: string;
  updated_at: string;

}
export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  status: 'active' | 'inactive';
  image: string | null;
  is_developer: boolean;
  is_developer_withdrawal_enabled: boolean;
  username: string;
  user_type: 'user' | 'developer';
  is_transactions_enabled: boolean;
  created_at: string;
  updated_at: string;
}



export interface UserData {
  name: string;
  email: string;
  mobile: string;
  status: 'active' | 'inactive';
  username: string;
  user : User;
  user_type: 'user' | 'developer';
  is_transactions_enabled: boolean;
  created_at: string;
  updated_at: string;
  subscription: Subscription;
  transactions: {
    data: Transaction[];
  };
}
