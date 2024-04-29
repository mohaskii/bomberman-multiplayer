package websockets

import (
	"log"
	"server/src/generate"
	"server/src/models"

	"github.com/gofiber/contrib/websocket"
)

func handleRoomRequestMsg(msg models.Msg, conn *websocket.Conn) {
	player := msg.GetPlayer()
	response := models.Msg{
		Type: "roomRequest",
	}
	numberOfPlayersInRoom := len(models.UserInTheRoom)
	if numberOfPlayersInRoom == 4 || models.RoomClose{
		response.Status = "declined"
		response.Content = "Room is full"
		conn.WriteJSON(response)
		return
	}

	player.Id = models.UserInTheRoom.GetAvailableId()
	player.InRoom = true
	log.Printf("player : %s joined the room", player.Nickname)

	response.Content = map[string]interface{}{
		"playerId":     player.Id,
		"otherPlayers": models.UserInTheRoom.ToJson(),
		"map":          generate.Maps,
	}

	if numberOfPlayersInRoom == 0 {
		conn.WriteJSON(response)
		models.UserInTheRoom = append(models.UserInTheRoom, player)
		return
	}

	models.UserInTheRoom.BroadcastMessage(models.Msg{
		Type: "new-player-in-the-room",
		Content: map[string]interface{}{
			"playerId": player.Id,
			"nickname": player.Nickname,
		},
	})
	conn.WriteJSON(response)
	models.UserInTheRoom = append(models.UserInTheRoom, player)
}
