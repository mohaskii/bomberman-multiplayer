package websockets

import (
	"log"
	"server/src/models"

	"github.com/gofiber/contrib/websocket"
)

func handleSocketMessage(T int, msg Msg, conn *websocket.Conn) {
	newMsg := models.Msg{}
	msg.Unmarshal(&newMsg)

	if newMsg.Type == "registration" {
		handleRegistrationMsg(newMsg, conn)
		return
	}

	if newMsg.Type == "chat" {
		handleChatMsg(newMsg, conn)
		return
	}

	if newMsg.Type == "roomRequest" {
		handleRoomRequestMsg(newMsg, conn)
		return
	}

	if newMsg.Type == "moves" || newMsg.Type == "bomb" || newMsg.Type == "life-loss" {
		models.UserInTheRoom.BroadcastMessage(newMsg)
		return
	}

	if newMsg.Type == "close-room" {
		log.Println("room closed")
		models.RoomClose = true
	}
	if newMsg.Type == "open-room"{
		models.RoomClose = false
	}


}
