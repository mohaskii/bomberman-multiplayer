import gameStores from "../stores/game-stores.js";
import websocketStore from "../stores/websocket-store.js";

export default {
  state: {
    firstTimerId: null,
    secondTimerId: null,
  },

  template: `<game-header-template ref="header"></game-header-template>
    <div
      @new-player-in-the-room="addPlayerNewPLayer.global"
      @player-left-the-room="removeThePlayer".global
      id="match-making-container"
    ²>
      <room-component ref="roomComponent"></room-component>
      <div class="timer" st ref="timer"></div>
    </div>`,
  props: {
    tag: `match-making-template`,
  },
  methods: {
    async requestRoom() {
      let response = await websocketStore.sendRoomRequest();
      console.log(response);
      let otherPlayer = response.content.otherPlayers;
      console.log("otherssssssssss\n", otherPlayer);
      let playerId = response.content.playerId;
      let map = response.content.map;
      gameStores.map = map;
      this.refs.roomComponent.addPlayerInTheRoomComponent(
        { id: playerId, nickname: "You" },
        gameStores.players.amount
      );
      gameStores.setPlayerNickname(playerId, gameStores.MyNickname);
      gameStores.myId = playerId;
      otherPlayer.forEach((element, i) => {
        gameStores.setPlayerNickname(element.playerId, element.nickname);
        this.refs.roomComponent.addPlayerInTheRoomComponent(
          { id: element.playerId, nickname: element.nickname },
          true
        );
      });
      if (gameStores.players.amount == 1) {
        return;
      }
      if (gameStores.players.amount == 4) {
        this.startSecondTimer();
        return;
      }
      if (gameStores.players.amount < 4) {
        this.startFirstTimer();
      }
    },
    addPlayerNewPLayer(e) {
      let newPlayerData = e.detail.content;
      gameStores.setPlayerNickname(
        newPlayerData.playerId,
        newPlayerData.nickname
      );
      this.refs.roomComponent.addPlayerInTheRoomComponent(
        { id: newPlayerData.playerId, nickname: newPlayerData.nickname },
        true
      );

      if (gameStores.players.amount == 4) {
        this.startSecondTimer();
        return;
      }
      if (gameStores.players.amount < 4) {
        this.startFirstTimer();
      }

    },
    removeThePlayer(e) {
      let PlayerData = e.detail.content;
      let playerStore = gameStores.players[`player${PlayerData.playerId + 1}`];
      playerStore.onGame = false;
      playerStore.nickname = undefined;

      playerStore.playerCardElement.remove();
      if (playerStore.topLineElement) playerStore.topLineElement.remove();

      gameStores.players.amount--;
    },
    startFirstTimer() {
      clearInterval(this.state.firstTimerId);
      let c = 20;
      this.state.firstTimerId = setInterval(() => {
        if (c === 0) {
          clearInterval(this.state.firstTimerId);
          this.startSecondTimer();
          // gameStores.gameContainerElement.loadGamePlay();
          return;
        }
        this.refs.timer.textContent = c;
        c--;
      }, 1000);
    },
    startSecondTimer() {
      clearInterval(this.state.firstTimerId);
      websocketStore.closeRoom();
      let c = 10;
      this.state.secondTimerId = setInterval(() => {
        if (c === 0) {
          clearInterval(this.state.secondTimerId);
          document.dispatchEvent(new CustomEvent("game-started"));
          gameStores.gameContainerElement.loadGamePlay();

          return;
        }
        this.refs.timer.textContent = c;
        c--;
      }, 1000);
    },
  },
  hooks: {
    onConnected() {
      if (!gameStores.gamePlayed) {
        this.requestRoom();
        this.refs.header.activeMenuMode();
        return;
      }
      const playerAlreadyInRoom = Object.values(gameStores.players).filter(
        (v) => v.onRoom
      );

      playerAlreadyInRoom.forEach((v, i) =>
        i == 0
          ? this.refs.roomComponent.addPlayerInTheRoomComponent(
              {
                id: v.id,
                nickname: v.nickname,
              },
              false,
              true
            )
          : this.refs.roomComponent.addPlayerInTheRoomComponent(
              {
                id: v.id,
                nickname: v.nickname,
              },
              true,
              true
            )
      );
      this.refs.header.activeMenuMode();
      if (playerAlreadyInRoom.length < 2) return;

      if (playerAlreadyInRoom.length == 4) {
        this.startSecondTimer();
        return;
      }

      this.startFirstTimer();
    },
    onDisconnected() {
      this.refs.header.activeOnGameHeader();
    },
  },
};
