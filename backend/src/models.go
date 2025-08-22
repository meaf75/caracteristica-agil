package src

import "time"

type EvaluationInput struct {
	MonthlyIncome float64 `json:"income"`
	MonthlyDebts  float64 `json:"debts"`
	LoanAmount    float64 `json:"loan"`
	PropertyValue float64 `json:"property"`
	CreditScore   int     `json:"credit"`
	OccupancyType string  `json:"occupancy"`
}

type EvaluationResult struct {
	ID        int64           `json:"id"`
	Decision  string          `json:"decision"`
	DTI       float64         `json:"dti"`
	LTV       float64         `json:"ltv"`
	Reasons   []string        `json:"reasons"`
	CreatedAt time.Time       `json:"created_at"`
	Input     EvaluationInput `json:"input"`
}
