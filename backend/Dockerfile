# Build stage
FROM golang:1.25-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o server .

# Run stage
FROM alpine:3.22
WORKDIR /app
COPY --from=builder /app/server .
COPY --from=builder /app/*.go .

ENV DATABASE_PATH=/app/data/mortgage.db
EXPOSE 8080

CMD ["./server"]
