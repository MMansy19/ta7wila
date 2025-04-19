export interface Plan {
  id: number;
  title: string;
  subtitle: string;
  amount: number;
  max_applications_count: number;
  max_employees_count: number;
  max_vendors_count: number;
  plan_id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  applications_count: number;
  employee_count: number;
  employees_count: number;
  vendors_count: number;
  subscription_type?: string;  
  status?: string; 
}
