export interface User {
  id: number;
  name: string;
  webhook_url: string;
  mobile: string;
  email: string;
  image: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  application_id: string;
  employees: {
    noData: string;
    table: {
      status: string;
      createdAt: string;
      actions: string;
    };
  };
}

export interface Store {
  id: number;
  name: string;
}