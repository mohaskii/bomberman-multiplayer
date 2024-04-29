import gameStores from "../stores/game-stores.js";
import websocketStore from "../stores/websocket-store.js";

export default {
  state: {},
  template: `<div
    @registration-success="initMenu.global"
    ref="gameContainer"
    id="game-container"
  >
    <div class="game-container-background" ref="background"></div>
    <h1
      ref="firtStatus"
      style="    display: none;
          z-index: 111;
          position: absolute;
          font-size: 4em;
      ;"
    >
      
    </h1>
  </div>`,
  props: {
    tag: "game-container",
  },
  methods: {
    loadGamePlay() {
      if (this.state.gameMenuElement) {
        this.state.gameMenuElement.remove();
      }
      // this.refs.background.style.filter = "blur(13px)";
      let GameplayProtype = window.customElements.get("game-play-template");
      let newGamePlay = new GameplayProtype();

      document.dispatchEvent(new CustomEvent("game-start"));

      this.state.gamePlayElement = newGamePlay;
      this.refs.gameContainer.appendChild(newGamePlay);
      gameStores.gamePlayed = true;
    },

    loadGameMenu(status) {
      if (this.state.gamePlayElement) {
        this.state.gamePlayElement.remove();
      }
      if (status === "die") {
        this.refs.firtStatus.style.display = "block";
        this.refs.firtStatus.textContent = "You Lose The Game";
        websocketStore.openRoom()
        // setTimeout(() => {
        //   this.initMenu();
        // }, 5000);
        return;
      }
      if (status === "win") {
        this.refs.firtStatus.style.display = "block";
        this.refs.firtStatus.textContent = "you win";
        websocketStore.openRoom()
        // setTimeout(() => {
        //   this.initMenu();
        // }, 5000);
        

        return;
      }
      let newGameMenu = window.customElements.get("game-registration-template");
      this.refs.gameContainer.appendChild(new newGameMenu());
    },

    initMenu() {
      if (this.state.gamePlayElement) {
        this.state.gamePlayElement.remove();
      }
      let matchMaking = window.customElements.get("match-making-template");
      let MatchMakingMenuElement = new matchMaking();
      this.refs.background.style.filter = "blur(13px)";
      this.refs.gameContainer.appendChild(MatchMakingMenuElement);
      this.state.gameMenuElement = MatchMakingMenuElement;
    },

    addListener() {},
  },
  hooks: {
    onConnected() {
      gameStores.gameContainerElement = this;
      // document.addEventListener("registration-success" , this.blurBackground)
      // this.loadGamePlay();

      this.loadGameMenu();
    },
  },
};
