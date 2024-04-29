import gameStores from "../stores/game-stores.js";

export default {
  template: `
    <div class="room-header">Players in the room</div>
    <div ref ="playersContainer"  class="players-container border-top border-light"> </div>
    `,
  props: {
    tag: `room-component`,
  },
  methods: {
    fillPlayersContainer(PlayersIn) {},
    addPlayerInTheRoomComponent(obj, haveTopLine, allReadyIn = false) {
      let playerPrototype = customElements.get("player-card");
      let newPlayerCard = new playerPrototype(obj);
      let playerStore = gameStores.players[`player${obj.id + 1}`];

      if (haveTopLine) {
        let bottomLine = document.createElement("hr");
        this.refs.playersContainer.appendChild(bottomLine);
        playerStore.topLineElement = bottomLine;
      }

      this.refs.playersContainer.appendChild(newPlayerCard);
      playerStore.playerCardElement = newPlayerCard;

      if (allReadyIn) return;
      gameStores.players.amount++;
      playerStore.onRoom = true;
    },
    innitPlayerContainer() {},
  },
};
