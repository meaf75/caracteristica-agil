package main

import (
	"backend/src"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	frontendUrl := os.Getenv("FRONTEND_URL")

	if frontendUrl == "" {
		frontendUrl = "http://localhost:3000"
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontendUrl},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	return r
}

func main() {
	r := SetupRouter()

	// setup storage
	storage, err := src.NewStorage("data/mortgage.db")
	if err != nil {
		log.Fatalf("could not init storage: %v", err)
	}

	// setup routes
	src.RegisterRoutes(r, storage)

	// run
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
