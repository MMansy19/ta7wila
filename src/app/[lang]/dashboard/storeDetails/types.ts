export interface Params {
  id: string;
  lang: string;
}


export type Transaction = {

  id: number;
  transaction_id: number | null;
  ref_id: string;
  amount: number;
  mobile: string | null;
  sender_name: string;
  transaction_date: string | null;
  status: string;
  payment_option: string;
  created_at: string;
  updated_at: string;
  application_id: number;
  customer_id: number | null;
  user_id: number;
  user: {
    id: number;
    name: string;
  };
  checkout_employees: Array<{
    id: number;
    name: string;
  }>;
  application: {
    id: number;
    name: string;
    logo: string;
    email: string;
  };
  payments:{
    id: number;
    value: string,
    max_daily_transactions_amount: number,
    max_monthly_transactions_amount: number,
    ref_id: number,
    is_public: boolean,
    status: string,
    payment_option: string,
    created_at: string,
    updated_at: string,
    application_id: number,
    user_id: number
  }
};

export type ApiResponse = {
  success: boolean;
  result: {
    data: Transaction[];
  };
};
