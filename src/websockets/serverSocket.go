package websockets

import (
	"fmt"
	"server/src/models"

	"github.com/gofiber/contrib/websocket"
)

var SerVerSocket = InitWebsocket("/ws")

func init() {
	SerVerSocket.OnConnect(
		func(conn *websocket.Conn) {
			fmt.Println(conn.RemoteAddr().String())
			fmt.Println()
		},
	)

	SerVerSocket.OnMessage(handleSocketMessage)

	SerVerSocket.OnClose(func(conn *websocket.Conn) {
		models.RemovePlayer(conn)
	})

	all = append(all, SerVerSocket)
}
