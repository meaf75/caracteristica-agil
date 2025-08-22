package src

import "testing"

func TestEvaluateApprove(t *testing.T) {
	input := EvaluationInput{
		MonthlyIncome: 5000,
		MonthlyDebts:  1500,
		LoanAmount:    160000,
		PropertyValue: 200000,
		CreditScore:   700,
		OccupancyType: "Primary",
	}

	decision, dti, ltv, reasons := Evaluate(input)

	if decision != "Approve" {
		t.Errorf("expected Approve, got %s", decision)
	}
	if dti > 0.43 {
		t.Errorf("expected DTI <= 0.43, got %f", dti)
	}
	if ltv > 0.80 {
		t.Errorf("expected LTV <= 0.80, got %f", ltv)
	}
	if len(reasons) == 0 {
		t.Error("expected at least one reason")
	}
}

func TestEvaluateRefer(t *testing.T) {
	input := EvaluationInput{
		MonthlyIncome: 4000,
		MonthlyDebts:  1800,   // DTI = 0.45 (entre 0.43 y 0.50)
		LoanAmount:    180000, // LTV = 0.90 (entre 0.80 y 0.95)
		PropertyValue: 200000,
		CreditScore:   670, // entre 660 y 680
		OccupancyType: "Primary",
	}

	decision, _, _, _ := Evaluate(input)

	if decision != "Refer" {
		t.Errorf("expected Refer, got %s", decision)
	}
}

func TestEvaluateDecline(t *testing.T) {
	input := EvaluationInput{
		MonthlyIncome: 2000,
		MonthlyDebts:  1500,   // DTI = 0.75 > 0.50
		LoanAmount:    190000, // LTV = 0.95
		PropertyValue: 200000,
		CreditScore:   600, // < 660
		OccupancyType: "Primary",
	}

	decision, _, _, _ := Evaluate(input)

	if decision != "Decline" {
		t.Errorf("expected Decline, got %s", decision)
	}
}
