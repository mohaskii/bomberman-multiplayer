package websockets

import (
	"log"
	"server/src/models"

	"github.com/gofiber/contrib/websocket"
)

func handleRegistrationMsg(msg models.Msg, conn *websocket.Conn) {
	potentialPlayer := msg.GetPlayer()

	res := models.Msg{}
	// in this case the user the nickname requested is already registered
	if potentialPlayer != nil  {
		log.Printf("user: %s registration declined", msg.SenderNicKname)
		res.SendDeclinedRegistration(conn)
		return
	}
	// register the new Player
	newPlayer := msg.NewPlayer(conn)
	models.BroadcastToAll(models.Msg{
		Type: "newPlayerInTheChat",
		Content: map[string]string{
			"Nickname": newPlayer.Nickname,
		},
	})
	models.PlayersDataBase = append(models.PlayersDataBase, newPlayer)
	res.SendSuccessRegistration(conn)
	log.Printf("user: %s is successfully registered", msg.SenderNicKname)

}
