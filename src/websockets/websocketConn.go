package websockets

import (
	"encoding/json"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

type SocketMsgEventHandler func(msgType int, msg Msg, conn *websocket.Conn)
type SocketCloseAndConnectedEventHandler func(conn *websocket.Conn)

type webSocketHandler struct {
	path              string
	onMessageCallback SocketMsgEventHandler
	onCloseCallback   SocketCloseAndConnectedEventHandler
	onConnectCallback SocketCloseAndConnectedEventHandler
}

type Msg []byte

func (msg *Msg) Unmarshal(v interface{}) {
	json.Unmarshal(*msg, &v)
}

func (wh *webSocketHandler) OnMessage(callBack SocketMsgEventHandler) {
	wh.onMessageCallback = callBack
}
func (wh *webSocketHandler) OnClose(callBack SocketCloseAndConnectedEventHandler) {
	wh.onCloseCallback = callBack
}
func (wh *webSocketHandler) OnConnect(callBack SocketCloseAndConnectedEventHandler) {
	wh.onConnectCallback = callBack
}

func (wh *webSocketHandler) handleSocket(conn *websocket.Conn) {
	var (
		t       int
		msg     Msg
		err     error
		connect = false
	)

	for {
		if wh.onConnectCallback != nil && !connect {
			wh.onConnectCallback(conn)
			connect = true
		}

		if t, msg, err = conn.ReadMessage(); err != nil {
			if wh.onCloseCallback == nil {
				return
			}
			wh.onCloseCallback(conn)
			return
		}
		wh.onMessageCallback(t, msg, conn)
	}
}

var all = []*webSocketHandler{}

func (wh *webSocketHandler) Listen(app *fiber.App) {
	app.Get(wh.path, websocket.New(wh.handleSocket))
}

func InitWebsocket(path string) *webSocketHandler {
	return &webSocketHandler{path: path}
}

func Run(app *fiber.App) {
	for _, w := range all {
		w.Listen(app)
	}
}
