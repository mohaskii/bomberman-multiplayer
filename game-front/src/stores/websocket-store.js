import gameStores from "./game-stores.js";

export default {
  path: null,
  ws: null,
  events: {
    registration: (data) => new CustomEvent("registration", data),
    moves: (data) => new CustomEvent("moves", data),
    roomRequest: (data) => new CustomEvent("roomRequest", data),
    "new-player-in-the-room": (data) =>
      new CustomEvent("new-player-in-the-room", data),
    newPlayerInTheChat: (data) => new CustomEvent("newPlayerInTheChat", data),
    "player-left-the-room": (data) =>
      new CustomEvent("player-left-the-room", data),
    "player-left-the-chat": (data) =>
      new CustomEvent("player-left-the-chat", data),
    chat: (data) => new CustomEvent("chat", data),
    bomb: (data) => new CustomEvent("bomb", data),
    "life-loss": (data) => new CustomEvent("life-loss", data),
  },

  /**
   * Établit la connexion WebSocket.
   * @returns {void}
   */
  establishConnection() {
    this.ws = new WebSocket(`ws://${location.host}/ws`);
    this.ws.onmessage = this.socketMessageDispatcher.bind(this);
  },
  socketMessageDispatcher(event) {
    let responseJson = JSON.parse(event.data);

    document.dispatchEvent(
      this.events[responseJson.type]({ detail: responseJson })
    );
  },

  /**
   * Envoie un message de registration.
   * @param {string} Nickname - Le nom d'utilisateur à enregistrer.
   * @returns {void}
   */
  async sendRegistrationMessage(Nickname) {
    let msg = {
      type: "registration",
      senderNicKname: Nickname,
    };
    let registrationResponse = new Promise((resolve) => {
      document.addEventListener("registration", (e) => {
        resolve(e.detail);
      });
    });
    this.ws.send(JSON.stringify(msg));
    return await registrationResponse;
  },
  /**
   *
   * @param {void}
   * @returns {Promise<object>}
   */
  async sendRoomRequest() {
    let roomRequestObj = {
      senderNicKname: gameStores.MyNickname,
      type: "roomRequest",
    };
    this.ws.send(JSON.stringify(roomRequestObj));
    return await new Promise((resolve) =>
      document.addEventListener("roomRequest", (e) => resolve(e.detail))
    );
  },

  /**
   * Description placeholder
   * @date 11/04/2024 - 14:53:26
   *
   * @param {string} keys
   * @returns {void}
   */
  sendMoveKeys(keyProps) {
    this.ws.send(
      JSON.stringify({
        type: "moves",
        content: {
          id: gameStores.myId,
          keyProps,
        },
      })
    );
  },

  sendMessage(message) {
    this.ws.send(
      JSON.stringify({
        type: "chat",
        content: message.content,
        senderNicKname: gameStores.MyNickname,
      })
    );
  },

  sendBombState(bomb) {
    this.ws.send(
      JSON.stringify({
        type: "bomb",
        content: bomb,
        senderNicKname: gameStores.MyNickname,
      })
    );
  },
  closeRoom() {
    this.ws.send(
      JSON.stringify({
        type: "close-room",
      })
    );
  },
  openRoom() {
    this.ws.send(
      JSON.stringify({
        type: "open-room",
      })
    );
  },
  sendLifeLoss(playerId) {
    this.ws.send(
      JSON.stringify({
        type: "life-loss",
        content: { playerId },
      })
    );
  },
};
