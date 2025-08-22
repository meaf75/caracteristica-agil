package src

import (
	"database/sql"
	"encoding/json"

	_ "modernc.org/sqlite"
)

type Storage struct {
	db *sql.DB
}

/*
Setups up a new storage instance with the given database path

Also creates the evaluations table if it does not exist
*/
func NewStorage(path string) (*Storage, error) {
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, err
	}

	query := `
	CREATE TABLE IF NOT EXISTS evaluations (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		decision TEXT,
		dti REAL,
		ltv REAL,
		reasons TEXT,
		created_at DATETIME,
		input TEXT
	);`
	_, err = db.Exec(query)
	if err != nil {
		return nil, err
	}

	return &Storage{db: db}, nil
}

func (s *Storage) SaveEvaluation(res EvaluationResult) error {
	reasonsJSON, _ := json.Marshal(res.Reasons)
	inputJSON, _ := json.Marshal(res.Input)

	_, err := s.db.Exec(
		`INSERT INTO evaluations (decision, dti, ltv, reasons, created_at, input)
		 VALUES (?, ?, ?, ?, ?, ?)`,
		res.Decision, res.DTI, res.LTV, string(reasonsJSON), res.CreatedAt, string(inputJSON),
	)
	return err
}

func (s *Storage) GetEvaluations() ([]EvaluationResult, error) {
	rows, err := s.db.Query(`SELECT id, decision, dti, ltv, reasons, created_at, input FROM evaluations ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []EvaluationResult
	for rows.Next() {
		var res EvaluationResult
		var reasonsStr, inputStr string
		err := rows.Scan(&res.ID, &res.Decision, &res.DTI, &res.LTV, &reasonsStr, &res.CreatedAt, &inputStr)
		if err != nil {
			return nil, err
		}
		json.Unmarshal([]byte(reasonsStr), &res.Reasons)
		json.Unmarshal([]byte(inputStr), &res.Input)
		results = append(results, res)
	}
	return results, nil
}
