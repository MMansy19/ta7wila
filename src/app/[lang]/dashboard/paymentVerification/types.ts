export interface PaymentData {
    id: number;
    ref_id: string;
    value: string;
    payment_option: string;
    status: string;
    created_at: string;
    updated_at: string;
    user_id: number;
    payment_id: number;
    transaction_id: string | null;
    application_id: number;
    transaction: any;
    user: {
      name: string;
      mobile: string;
      email: string;
    };
    application: {
      id:number;
      name: string;
      logo: string;
      email: string;
    };
  }

  
export interface PaymentOption {
    id: string;
    value: string;
    name: string;
    key: string;
    img: string;
  };


 export interface TransactionData {
    ref_id: string;
    sender_name: string;
    mobile: string;
    amount: number;
    transaction_date: string | null;
    created_at:string | null;
    status: string;
  }