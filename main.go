package main

import (
	"server/src/handlers"
	"server/src/websockets"

	"github.com/gofiber/fiber/v2"
)

func main() {
	// init app
	app := fiber.New()
	// serve need client file 
	app.Static("/game-front", "game-front")
	// lunch all endpoints handlers
	handlers.HandleAll(app)
	//lund all websockets handlers
	websockets.Run(app)

	app.Listen(":8080")
}
