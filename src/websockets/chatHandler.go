package websockets

import (
	"server/src/models"
	"time"

	"github.com/gofiber/contrib/websocket"
)

func handleChatMsg(msg models.Msg, conn *websocket.Conn) {
	// TODO: handle chat logic here
	msg.Time = time.Now()
	sender := msg.GetPlayer()
	msg.Incoming = true
	sender.BroadcastMessage(msg)
	msg.Incoming = false
	if sender == nil {
		return
	}
	sender.Conn.WriteJSON(msg)


}
