package src

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func SetupRouterForTest() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.Default()

	// local storage in memory
	storage, _ := NewStorage(":memory:")

	RegisterRoutes(r, storage)

	return r
}

func TestEvaluateEndpoint(t *testing.T) {
	router := SetupRouterForTest()

	input := EvaluationInput{
		MonthlyIncome: 5000,
		MonthlyDebts:  1500,
		LoanAmount:    160000,
		PropertyValue: 200000,
		CreditScore:   700,
		OccupancyType: "Primary",
	}

	body, _ := json.Marshal(input)
	req, _ := http.NewRequest("POST", "/evaluate", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	var resp EvaluationResult
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to parse response: %v", err)
	}

	if resp.Decision != "Approve" {
		t.Errorf("expected Approve, got %s", resp.Decision)
	}
}

func TestEvaluate(t *testing.T) {
	tests := []struct {
		name     string
		input    EvaluationInput
		expected string
	}{
		{
			name: "Approve case",
			input: EvaluationInput{
				MonthlyIncome: 8000,
				MonthlyDebts:  2000, // DTI = 0.25
				LoanAmount:    200000,
				PropertyValue: 300000, // LTV = 0.66
				CreditScore:   720,    // >= 680
				OccupancyType: "primary",
			},
			expected: "Approve",
		},
		{
			name: "Refer case",
			input: EvaluationInput{
				MonthlyIncome: 6000,
				MonthlyDebts:  2800, // DTI ≈ 0.47 (refer)
				LoanAmount:    280000,
				PropertyValue: 300000, // LTV ≈ 0.93 (refer)
				CreditScore:   670,    // >= 660
				OccupancyType: "primary",
			},
			expected: "Refer",
		},
		{
			name: "Decline case",
			input: EvaluationInput{
				MonthlyIncome: 4000,
				MonthlyDebts:  3000, // DTI = 0.75 (muy alto)
				LoanAmount:    350000,
				PropertyValue: 300000, // LTV = 1.16 (muy alto)
				CreditScore:   600,    // bajo
				OccupancyType: "primary",
			},
			expected: "Decline",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, dti, ltv, _ := Evaluate(tt.input)

			if result != tt.expected {
				t.Errorf("expected %s, got %s (DTI=%.2f, LTV=%.2f)", tt.expected, result, dti, ltv)
			}
		})
	}
}
