export interface ApiResponse {
    success: boolean;
    result: {
      application: {
        payment_options: ('instapay' | 'ecash' | 'wecash')[];
        id: number;
        name: string;
        mobile: string;
        email: string;
        logo: string | null;
      };
      payments: {
        value: string;
        payment_option: 'instapay' | 'ecash' | 'wecash';
        id: number;
      }[];
      result: {
        amount: number;
        ref_id: string;
        status: 'not-paid' | 'paid' | string; 
      };
    };
  }
  
 export interface Errors {
    mobile?: string;
    amount?: string;
    application?: string;
  }