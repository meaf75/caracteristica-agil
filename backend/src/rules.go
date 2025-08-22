package src

import "fmt"

func Evaluate(input EvaluationInput) (string, float64, float64, []string) {
	var reasons []string

	dti := float64(input.MonthlyDebts) / float64(input.MonthlyIncome)
	ltv := float64(input.LoanAmount) / float64(input.PropertyValue)

	fmt.Printf("DEBUG: dti=%.2f, ltv=%.2f, fico=%d\n", dti, ltv, input.CreditScore)

	// Approve
	if dti <= 0.43 && ltv <= 0.80 && input.CreditScore >= 680 {
		reasons = append(reasons, "Meets all approval criteria")
		return "Approve", dti, ltv, reasons
	}

	// Refer
	if dti <= 0.50 && ltv <= 0.95 && input.CreditScore >= 660 {
		reasons = append(reasons, "Requires manual review")
		if dti > 0.43 {
			reasons = append(reasons, fmt.Sprintf("DTI too high (%.2f > 0.43)", dti))
		}
		if ltv > 0.80 {
			reasons = append(reasons, fmt.Sprintf("LTV too high (%.2f > 0.80)", ltv))
		}
		if input.CreditScore < 680 {
			reasons = append(reasons, fmt.Sprintf("Credit score below 680 (%d)", input.CreditScore))
		}
		return "Refer", dti, ltv, reasons
	}

	// Decline
	reasons = append(reasons, "Does not meet criteria for Approve or Refer")
	return "Decline", dti, ltv, reasons
}
