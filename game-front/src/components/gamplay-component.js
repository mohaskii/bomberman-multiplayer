import gameStores from "../stores/game-stores.js";
import websocketStore from "../stores/websocket-store.js";

export default {
  template: ` <game-header-template></game-header-template>
    <div id="gamplay-container" @keyup = "keyUpHandler.global" @keydown = "keyDownHandler.global" @moves="handleMoveMessages.global" >
      <map-bomberman ref="map"></map-bomberman>
    </div>
    `,
  props: {
    tag: `game-play-template`,
  },
  methods: {
    keyUpHandler(event) {
      if (event.key === " ") {
        const player = gameStores.players[`player${gameStores.myId + 1}`];
        if (!player.canPlaceBomb) {
          return;
        }
        const bomb = {
          coord: {
            x: Math.round(player.positionX),
            y: Math.round(player.positionY),
          },
          range: player.bombeRange,
          terroristId: gameStores.myId,
        };

        websocketStore.sendBombState({
          type: "bomb",
          value: bomb,
        });

        player.stopPlaceBombeAbilityForABit();
      }
      if (event.key === "ArrowLeft") {
        websocketStore.sendMoveKeys({
          type: "up",
          value: "ArrowLeft",
        });

        return;
      }
      if (event.key === "ArrowRight") {
        websocketStore.sendMoveKeys({
          type: "up",
          value: "ArrowRight",
        });

        return;
      }
      if (event.key === "ArrowUp") {
        websocketStore.sendMoveKeys({
          type: "up",
          value: "ArrowUp",
        });

        return;
      }
      if (event.key === "ArrowDown") {
        websocketStore.sendMoveKeys({
          type: "up",
          value: "ArrowDown",
        });

        return;
      }
    },

    keyDownHandler(event) {
      if (event.key === "ArrowLeft") {
        websocketStore.sendMoveKeys({
          type: "down",
          value: "ArrowLeft",
        });

        return;
      }
      if (event.key === "ArrowRight") {
        websocketStore.sendMoveKeys({
          type: "down",
          value: "ArrowRight",
        });

        return;
      }
      if (event.key === "ArrowUp") {
        websocketStore.sendMoveKeys({
          type: "down",
          value: "ArrowUp",
        });

        return;
      }
      if (event.key === "ArrowDown") {
        websocketStore.sendMoveKeys({
          type: "down",
          value: "ArrowDown",
        });

        return;
      }
    },

    upMessageHandler(value, PlayerTargetedMoveStates) {
      if (value == "ArrowLeft") {
        PlayerTargetedMoveStates.MovingLeft = false;
        PlayerTargetedMoveStates.lastDirection = "left";
        return;
      }
      if (value == "ArrowRight") {
        PlayerTargetedMoveStates.MovingRight = false;
        PlayerTargetedMoveStates.lastDirection = "right";
        return;
      }
      if (value == "ArrowUp") {
        PlayerTargetedMoveStates.MovingUp = false;
        PlayerTargetedMoveStates.lastDirection = "up";
        return;
      }
      if (value == "ArrowDown") {
        PlayerTargetedMoveStates.MovingDown = false;
        PlayerTargetedMoveStates.lastDirection = "down";
        return;
      }

      if (value == "Space") {
        return;
      }
    },

    downMessageHandler(value, PlayerTargetedMoveStates) {
      if (value == "ArrowLeft") {
        PlayerTargetedMoveStates.MovingLeft = true;
        return;
      }
      if (value == "ArrowRight") {
        PlayerTargetedMoveStates.MovingRight = true;
        return;
      }
      if (value == "ArrowUp") {
        PlayerTargetedMoveStates.MovingUp = true;
        return;
      }
      if (value == "ArrowDown") {
        PlayerTargetedMoveStates.MovingDown = true;
        return;
      }
    },

    handleMoveMessages(e) {
      let messageContent = e.detail.content;

      let playerId = messageContent.id;
      let keyValue = messageContent.keyProps.value;
      let keyType = messageContent.keyProps.type;
      let PlayerTargetedMoveStates =
        gameStores.players[`player${playerId + 1}`].MoveState;

      if (keyType == "up") {
        this.upMessageHandler(keyValue, PlayerTargetedMoveStates);
        return;
      }

      this.downMessageHandler(keyValue, PlayerTargetedMoveStates);
    },
  },
  hooks: {

  },
};
