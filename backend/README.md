# Stack

- Golang
- Sqlite

# API Endpoints
POST `/evaluate`

Evaluates a mortgage application based on the provided input.

<small>**Request Body:**</small>

```json
{
  "income": "float",
  "debts": "float",
  "loan": "float",
  "property": "float",
  "credit": "int",
  "occupancy": "string"
}
```

**Fields**
- `income` (float): Monthly income of the applicant.
- `debts` (float): Monthly debts of the applicant.
- `loan` (float): Requested loan amount.
- `property` (float): Value of the property.
- `credit` (int): Applicant's credit score.
- `occupancy` (string): Type of occupancy (e.g., "primary", "secondary").


**Response**:

- `200 OK`: Returns an EvaluationResult object containing the decision, DTI, LTV, reasons, and input data.
- `400 Bad Request`: If the input is invalid, returns an error message.
- `500 Internal Server Error`: If the evaluation could not be saved, returns an error message.

---

GET `/evaluations`

Retrieves all stored mortgage evaluations.

- **Response**:
    - `200 OK`: Returns a list of all evaluation results.
    ```json
    {
        "id": "int",
        "decision": "string",
        "dti": "float",
        "ltv": "float",
        "reasons": ["string"],
        "created_at": "string (ISO 8601 datetime)",
        "input": {
            "income": "float",
            "debts": "float",
            "loan": "float",
            "property": "float",
            "credit": "int",
            "occupancy": "string"
        }
    }
    ```


    - `500 Internal Server Error`: If evaluations could not be fetched, returns an error message.

# Run

    go run .

# Run with docker 

    docker compose -f 'docker-compose.yml' up -d --build