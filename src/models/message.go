package models

import (
	"time"

	"github.com/gofiber/contrib/websocket"
)

type Msg struct {
	Type           string      `json:"type"`
	SenderNicKname string      `json:"senderNicKname"`
	Content        interface{} `json:"content"`
	Status         string      `json:"status"`
	SenderId       string      `json:"senderId"`
	Incoming       bool        `json:"incomming"`
	Time           time.Time   `json:"time"`
}

func (m *Msg) GetPlayer() *Player {
	for _, player := range PlayersDataBase {
		if m.SenderNicKname == player.Nickname {
			return player
		}
	}
	return nil
}

func (m *Msg) NewPlayer(conn *websocket.Conn) *Player {
	return &Player{
		Conn:     conn,
		Nickname: m.SenderNicKname,
	}
}

func (msg *Msg) SendDeclinedRegistration(conn *websocket.Conn) {
	msg.Status = "declined"
	msg.Type = "registration"
	conn.WriteJSON(msg)
}

func (msg *Msg) SendSuccessRegistration(conn *websocket.Conn) {
	msg.Status = "success"
	msg.Type = "registration"
	conn.WriteJSON(msg)
}
