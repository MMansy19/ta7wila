
export type CheckoutDetails = {
    id: number;
    item_id: string;
    ref_id: string;
    paid_at: string | null;
    amount: number;
    status: string;
    created_at: string;
    updated_at: string;
    extra: string;
    redirect_frame_url: string;
    application: {
      id: number;
      name: string;
      email: string;
      mobile: string;
      logo: string | null;
    };
    customer: {
      id: number;
      name: string;
      email: string;
      mobile: string;
    };
  };
  
 export interface Params {
    id: string;
    lang: string;
  }