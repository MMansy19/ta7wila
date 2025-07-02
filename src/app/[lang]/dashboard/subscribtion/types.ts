
export interface Plan {
    id: number;
    amount: number;
    title: string;
    subtitle: string;
    max_applications_count: number;
    max_employees_count: number;
    max_vendors_count: number;
    applications_count: number;
    employees_count: number;
    vendors_count: number;
    subscription_type: 'monthly' | 'yearly';
    status: string;
    created_at: string;
    updated_at: string;
    plan_id: number;  
    user_id: number;   
    user:{
      name:string;
      email:string;
      mobile:string;
    }
  }


  




 export interface PlanResult {
    data: Plan[];
  }
  
export  interface ApiResponse {
    success: boolean;
    result: PlanResult;
  }
  
  export interface SubscriptionModalProps {
    selectedSubscription: Plan;
    onClose: () => void;
  }
  

  