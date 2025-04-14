export interface Vendor {
    id: number;
    name: string;
    image: string | null;
    mobile: string;
    email: string;
  }
  
 export interface Log {
    id: number;
    webhook_url: string;
    data: string;
    statusCode: number;
    status: string;
    created_at: string;
    updated_at: string;
    vendor_id: number;
    transaction_id: number;
    vendor: Vendor | null;
  }
 export  interface Params {
    id: string;
    lang: string;
  }