import miniFramework from "../miniFramework/miniFramework.js";
import gameStores from "../stores/game-stores.js";
import websocketStore from "../stores/websocket-store.js";
// const myRound = (v) => {
//   let l = v - Math.floor(v);
//   if (l > 0.6) {
//     return Math.floor(v) + 1;
//   }
//   if (l < 0.4) {
//     return Math.floor(v);
//   }
//   return v;
// };
export default {
  // Template HTML pour le composant de la carte
  template: `<div ref = "globalMap" @bomb="handlePlantedBomb.global"  @game-start="initPlayersOnGame.global" @life-loss="handleLifeLoss.global" id="gameMap"></div>`,
  // État initial du composant
  state: {
    brickConstructor: null,
    playerConstructor: null,
  },
  // Propriétés du composant
  props: {
    tag: "map-bomberman",
  },
  // État du composant, qui inclut la disposition de la carte du jeu
  state: {
    players: null,
    brickConstructor: null,
  },
  // Méthodes du composant
  methods: {
    // Méthode pour afficher la carte en fonction du tableau BombermanMap

    displayMap() {
      // TODO: Implémenter la logique pour afficher la carte
      const BombermanMap = gameStores.map;
      for (let i = 0; i < BombermanMap.length; i++) {
        for (let j = 0; j < BombermanMap[i].length; j++) {
          const cellType = BombermanMap[i][j];
          if (cellType === 1) {
            this.addBrick({ type: "unBreakable", coords: { x: j, y: i } });
          } else if (cellType === 2) {
            this.addBrick({ type: "breakable", coords: { x: j, y: i } });
          } else if (cellType === 4) {
            this.addBrick({ type: "powerUp1", coords: { x: j, y: i } });
            this.addBrick({ type: "breakable", coords: { x: j, y: i } });
          } else if (cellType === 5) {
            this.addBrick({ type: "powerUp2", coords: { x: j, y: i } });
            this.addBrick({ type: "breakable", coords: { x: j, y: i } });
          } else if (cellType === 6) {
            this.addBrick({ type: "powerUp3", coords: { x: j, y: i } });
            this.addBrick({ type: "breakable", coords: { x: j, y: i } });
          }
        }
      }
    },
    // Méthode pour ajouter une brique à la carte
    addBrick(args) {
      const brickConstructor = this.state.brickConstructor;

      let NewBrick = new brickConstructor({
        src: gameStores.bricks[args.type].src,
        coords: args.coords,
      });
      this.refs.globalMap.appendChild(NewBrick);
      if (args.type.includes("powerUp")) {
        gameStores.powerupElements.set(
          `${args.coords.x}-${args.coords.y}`,
          NewBrick
        );

        return;
      }

      gameStores.brickElements.set(
        `${args.coords.x}-${args.coords.y}`,
        NewBrick
      );
    },
    // Méthode pour initialiser un joueur sur la carte
    initPlayer(objArgs) {
      const playerConstructor = this.state.playerConstructor;

      let NewPlayer = new playerConstructor({ name: objArgs.name });
      this.refs.globalMap.appendChild(NewPlayer);

      NewPlayer.placePlayer(objArgs);
      gameStores.players[objArgs.name].playerElement = NewPlayer;
    },
    lunchGame() {
      this.gameLoop();
    },
    gameLoop() {
      let players = Object.values(gameStores.players);
      for (let player of players) {
        if (typeof player != "object" || !player.onGame) {
          continue;
        }
        player.updatePlayerPosition();
        let indexOfBmbeToRemove = [];

        for (let bi in player.placedBombs) {
          let bombe = player.placedBombs[bi];
          if (bombe.timer === 0) {
            try {
              this.handleBombeBlowUp(bombe);
            } catch (error) {}
            gameStores.map[bombe.coord.y][bombe.coord.x] = 0;
            bombe.remove();
            indexOfBmbeToRemove.push(parseInt(bi));
            continue;
          }
          bombe.timer--;
        }
        indexOfBmbeToRemove.forEach((i) => player.placedBombs.splice(i, 1));
      }

      gameStores.updateBombState();

      setTimeout(requestAnimationFrame(this.gameLoop), 60);
    },
    initPlayersOnGame() {
      for (let player of Object.values(gameStores.players)) {
        if (typeof player == "object" && player.onRoom) {
          this.initPlayer({
            name: `player${player.id + 1}`,
            direction: player.startingDirection,
            coords: player.startingPos,
          });
        }
      }
    },
    handlePlantedBomb(e) {
      const bomb = e.detail.content.value;
      const bombElem = customElements.get("bomb-component");

      bomb.elem = new bombElem(bomb);

      bomb.elem.style.top = gameStores.scale(bomb.coord.y);
      bomb.elem.style.left = gameStores.scale(bomb.coord.x);

      // gameStores.map[bomb.coord.y][bomb.coord.x] = 8;

      this.refs.globalMap.appendChild(bomb.elem);
      // gameStores.map[bomb.coord.y][bomb.coord.x] = 9
      console.log(
        "bomb has been planted at coord:",
        [bomb.coord.x, bomb.coord.y].toString()
      );
    },

    blowUpCell(x, y) {
      let e = window.customElements.get("explosion-component");
      this.refs.globalMap.appendChild(new e({ x, y }));
    },
    handleBombeBlowUp(bomb) {
      let [x, y, range] = [bomb.coord.x, bomb.coord.y, bomb.range];
      console.log(x, y, range);
      let players = Object.values(gameStores.players);

      let [begin, end] = [x + range, x - range];

      if (range > 1 && gameStores.map[y][begin - 1] == 1) {
        begin--;
      }
      if (range > 1 && gameStores.map[y][end + 1] == 1) {
        end++;
      }

      //horizontal
      for (let i = begin; i >= end; i--) {
        // if (i <= 1 || i >= 18 || i === range + 1) {
        //   continue
        // }
        let c = gameStores.map[y][i];
        if (c == 1) {
          continue;
        }
        this.blowUpCell(i, y);

        for (let player of players) {
          if (typeof player !== "object") {
            continue;
          }
          if (
            Math.ceil(player.positionX) == i &&
            Math.ceil(player.positionY) == y &&
            i != x &&
            player.isMe()
          ) {
            console.log("lolo");
            websocketStore.sendLifeLoss(player.id);
          }
          console.log(gameStores.map[y][i]);
          if (gameStores.isBrick(i, y)) {
            gameStores.brickElements.get(`${i}-${y}`).remove();
            if (gameStores.isPowerUp(i, y)) {
              console.log(gameStores.map[y][i]);

              console.log("Power");
              gameStores.map[y][i] += 3;
              continue;
            }

            gameStores.map[y][i] = 0;
          }
        }
      }

      [begin, end] = [y + range, y - range];

      if (range > 1 && gameStores.map[begin - 1][x] == 1) {
        begin--;
      }
      if (range > 1 && gameStores.map[end + 1][x] == 1) {
        end++;
      }

      //vertical
      for (let i = begin; i >= end; i--) {
        // if (i <= 1 || i >= 18) {
        //   continue
        // }
        let c = gameStores.map[i][x];
        if (c == 1) {
          continue;
        }
        this.blowUpCell(x, i);
        for (let player of players) {
          if (typeof player !== "object") {
            continue;
          }

          if (
            Math.ceil(player.positionY) == i &&
            Math.ceil(player.positionX) == x &&
            player.isMe()
          ) {
            console.log("lolo");
            websocketStore.sendLifeLoss(player.id);
          }
          if (gameStores.isBrick(x, i)) {
            console.log(gameStores.map[i][x]);
            gameStores.brickElements.get(`${x}-${i}`).remove();
            if (gameStores.isPowerUp(x, i)) {
              gameStores.map[i][x] += 3;
              console.log("Power");
              continue;
            }
            gameStores.map[i][x] = 0;
          }
        }
      }
    },
    handleLifeLoss(e) {
      let player = gameStores.getPlayerById(e.detail.content.playerId);
      player.decreaseLives();
    },
  },
  // Hooks du composant
  hooks: {
    onConnected() {
      gameStores.mapElement = this;
      window.map = gameStores.map;
      //retrieve needed constructors
      this.state.brickConstructor =
        miniFramework.virtualDom.customElementsConstructor["bricks-img"];
      this.state.playerConstructor =
        miniFramework.virtualDom.customElementsConstructor["player-template"];

      this.displayMap();
      console.log();
      gameStores.brickElements.get("0-0").remove();
      this.initPlayersOnGame();

      console.log(gameStores.map);
      this.lunchGame();
    },
  },
};
