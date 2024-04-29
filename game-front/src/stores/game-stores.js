import playerStoreModel from "../models/player-store-model.js";
const imagePath = "game-front/assets/images/";

export default {
  brickElements: new Map(),
  map: [],
  bombs: [],
  gameContainerElement: null,
  imagePath,
  nBombs: 0,
  powerupElements: new Map(),
  myId: null,
  MyNickname: null,
  gameSpeed: 0.8,
  scale: (v) => `${v * 5}%`,
  gamePlayed : false,
  bricks: {
    breakable: {
      src: imagePath + "O-B.png",
    },
    unBreakable: {
      src: imagePath + "sSolid_0.png",
    },
    powerUp1: {
      src: imagePath + "powerUp-1.png",
    },
    powerUp2: {
      src: imagePath + "powerUp-2.png",
    },
    powerUp3: {
      src: imagePath + "powerUp-3.png",
    },
    // other bricks
  },
  players: {
    amount: 0,
    player1: new playerStoreModel(0),
    player2: new playerStoreModel(1),
    player3: new playerStoreModel(2),
    player4: new playerStoreModel(3),
  },
  setPlayerNickname(id, nickname) {
    this.players[`player${id + 1}`].nickname = nickname;
    this.players[`player${id + 1}`].onGame = true;
  },
  haveCollision(y, x) {
    let r = this.map[y][x];
    return this.isBrick(x, y) || r === 1;
  },

  updateBombState() {
    this.bombs = this.bombs.map((bomb) => {
      bomb.timer--;
      if (bomb.timer <= 0) {
        bomb.elem.remove();
      }
      return bomb;
    });

    this.bombs = this.bombs.filter((bomb) => bomb.timer > 0);
  },

  isBrick(x, y) {
    return (
      this.map[y][x] == 2 ||
      this.map[y][x] == 4 ||
      this.map[y][x] == 5 ||
      this.map[y][x] == 6
    );
  },

  isPowerUp(x, y) {
    return this.map[y][x] == 4 || this.map[y][x] == 5 || this.map[y][x] == 6;
  },

  isPowerUp1(x, y) {
    return this.map[y][x] == 7 || this.map[y][x] == 8 || this.map[y][x] == 9;
  },

  powerUpHander: {
    4: (player) => {
      if ((player.bombeRange = 1)) {
        player.bombeRange++;
        setTimeout(() => (player.bombeRange = 1), 5000);
      }
    },
    5: (player) => {
      if (player.BombeFrequencyDelay > 1000) {
        player.BombeFrequencyDelay -= 1000;
        setTimeout(() => (player.BombeFrequencyDelay = 2000), 5000);
      }
    },
    6: (player) => {
      if (player.speed == 1) {
        player.speed++;
        setTimeout(() => (player.speed = 1), 5000);
      }
    },
  },

  getPlayerById(id) {
    return this.players[`player${id + 1}`];
  },
};

// BombermanMap: [
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
//     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
// ]

// [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
// [1, 0, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1],
// [1, 2, 1, 1, 2, 2, 1, 1, 1, 0, 2, 1, 1, 2, 1],
// [1, 0, 1, 2, 2, 0, 2, 1, 2, 2, 0, 2, 1, 2, 1],
// [1, 2, 1, 2, 2, 2, 0, 0, 2, 2, 0, 0, 1, 2, 1],
// [1, 2, 0, 0, 1, 1, 2, 2, 0, 1, 1, 2, 2, 0, 1],
// [1, 2, 0, 0, 0, 1, 1, 0, 1, 1, 2, 2, 2, 2, 1],
// [1, 2, 0, 0, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 1],
// [1, 2, 1, 2, 2, 2, 2, 0, 0, 2, 2, 2, 1, 2, 1],
// [1, 2, 1, 2, 2, 2, 0, 1, 2, 2, 2, 2, 1, 2, 1],
// [1, 2, 1, 1, 0, 2, 1, 1, 1, 2, 2, 1, 1, 2, 1],
// [1, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
// [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
