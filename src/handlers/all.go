package handlers

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
)

// routeConstructor is a type alias for a function that takes a path, a handler, and optional middlewares,
// and returns a fiber.Router instance.
type routeConstructor func(path string, handler ...fiber.Handler) fiber.Router

// route represents a single route configuration with its path, HTTP method, handler function,
// and any associated middleware functions.
type route struct {
	path        string
	method      string
	handler     fiber.Handler
	middlewares []fiber.Handler
}

// allAppRoot is a slice of route configurations that will be registered with the fiber.App instance.
var allAppRoot = []route{}

// HandleAll is a function that registers all the routes defined in the allAppRoot slice with the fiber.App instance.
// It uses a map of route constructors to create the appropriate router instances based on the HTTP method.
var HandleAll = func(app *fiber.App) {
	// mapRootConstructors maps HTTP methods to their corresponding route constructor functions.
	var mapRootConstructors = map[string]routeConstructor{
		http.MethodGet:  app.Get,
		http.MethodPost: app.Post,
	}
	// Iterate over all the routes in the allAppRoot slice and register them with the fiber.App instance.
	for _, v := range allAppRoot {
		allHandler := append([]fiber.Handler{v.handler}, v.middlewares...)
		mapRootConstructors[v.method](v.path, allHandler...,)
	}
}
