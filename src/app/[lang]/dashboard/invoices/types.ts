export type Invoice = {
    id: number;
    total_amount: number;
    total_fees: number;
    late_fees: number;
    developer_fees: number;
    paid_at: string;
  };