package handlers

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func handleDocumentRequest(c *fiber.Ctx) error {
	return c.SendFile("game-front/index.html")
}

var graphqlRoot = route{
	path:    "/",
	method:  http.MethodGet,
	handler: handleDocumentRequest,
}

func init() {
	allAppRoot = append(allAppRoot, graphqlRoot)
}
