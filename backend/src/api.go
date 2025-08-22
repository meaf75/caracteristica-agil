package src

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, storage *Storage) {
	r.POST("/evaluate", func(c *gin.Context) {
		var input EvaluationInput
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		decision, dti, ltv, reasons := Evaluate(input)

		result := EvaluationResult{
			Decision: decision,
			DTI:      dti,
			LTV:      ltv,
			Reasons:  reasons,
			Input:    input,
		}

		if err := storage.SaveEvaluation(result); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not save evaluation"})
			return
		}

		c.JSON(http.StatusOK, result)
	})

	r.GET("/evaluations", func(c *gin.Context) {
		evals, err := storage.GetEvaluations()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch evaluations"})
			return
		}
		c.JSON(http.StatusOK, evals)
	})
}
