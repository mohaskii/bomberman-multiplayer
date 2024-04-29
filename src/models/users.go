package models

import (
	"log"
	"server/src/generate"

	"github.com/gofiber/contrib/websocket"
)

type Player struct {
	Nickname string
	Conn     *websocket.Conn
	InRoom   bool
	Id       int
}
type Room []*Player

var (
	PlayersDataBase []*Player
	UserInTheRoom   Room
	RoomClose       = false
)

func (u *Player) SendMessage(msg string) {
}

func (u *Player) NoMovingRight() {

}

func (r *Room) BroadcastMessage(msg Msg) {
	for _, p := range *r {
		p.Conn.WriteJSON(msg)
	}
}

func (r *Room) ToJson() []map[string]interface{} {
	v := []map[string]interface{}{}
	for _, p := range *r {
		v = append(v, map[string]interface{}{
			"nickname": p.Nickname,
			"playerId": p.Id,
		})
	}
	return v
}
func (r *Room) GetAvailableId() int {
	t := true
	for i := 0; i < 4; i++ {
		for _, p := range *r {
			if i == p.Id {
				t = false
				break
			}
		}

		if !t {
			t = true
			continue
		}

		return i
	}
	return 0
}
func RemovePlayer(conn *websocket.Conn) {
	var (
		newDataBase []*Player
		newRoom     Room
		ThePlayer   *Player
	)
	for _, player := range UserInTheRoom {
		if player.Conn.RemoteAddr().String() == conn.RemoteAddr().String() {
			log.Printf("player :%s removed from the room", player.Nickname)
			ThePlayer = player
			generate.Maps = generate.GenerateMap()
			continue
		}
		newRoom = append(newRoom, player)
	}

	UserInTheRoom = newRoom
	if ThePlayer != nil {
		newRoom.BroadcastMessage(Msg{
			Type: "player-left-the-room",
			Content: map[string]interface{}{
				"nickname": ThePlayer.Nickname,
				"playerId": ThePlayer.Id,
			},
		})
	}

	for _, player := range PlayersDataBase {
		if player.Conn.RemoteAddr().String() == conn.RemoteAddr().String() {
			log.Printf("player :%s removed from the database", player.Nickname)
			ThePlayer = player
			continue
		}
		newDataBase = append(newDataBase, player)
	}

	PlayersDataBase = newDataBase
	if ThePlayer != nil {
		BroadcastToAll(Msg{
			Type: "player-left-the-chat",
			Content: map[string]interface{}{
				"nickname": ThePlayer.Nickname,
				"playerId": ThePlayer.Id,
			},
		})
	}

}

func BroadcastToAll(msg Msg) {
	for _, player := range PlayersDataBase {
		player.Conn.WriteJSON(msg)
	}
}

func (p *Player) BroadcastMessage(msg Msg) {
	for _, player := range PlayersDataBase {
		if p.Id != player.Id {
			player.Conn.WriteJSON(msg)

		}
	}
}

// func (r *Room)
