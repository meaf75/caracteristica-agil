export type Evaluation = {
  id: number;
  input: {
    credit: number;
    debts: number;
    income: number;
    loan: number;
    occupancy: string;
    property: number;
  }
  decision: string;
  dti: number;
  ltv: number;
  reasons: string[];
  created_at: string;
};