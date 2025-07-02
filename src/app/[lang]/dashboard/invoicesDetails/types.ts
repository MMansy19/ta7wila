export interface Params {
  id: string;
  lang: string;
}

export interface Invoice {
  id: number;
  status: string;
  total_amount: number;
  subscription_amount: number;
  subscription_period: number;
  subscription_type: string;
  amount_without_fees: number;
  amount_includes_fees: number;
  total_fees: number;
  late_fees: number;
  developer_fees: number;
  invoice_date: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  user: {
    id: number;
    name: string;
    email: string;
    mobile: string;
    is_developer: boolean;
  };
}
