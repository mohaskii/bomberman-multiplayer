import gameStores from "../stores/game-stores.js";
import websocketStore from "../stores/websocket-store.js";
const imagePath = "game-front/assets/images/";
const nonDecimal = (v) => v - Math.floor(v) == 0;
const myRound = (v) => {
  let l = v - Math.floor(v);
  if (l > 0.58) {
    return Math.floor(v) + 1;
  }
  if (l < 0.4) {
    return Math.floor(v);
  }
  return v;
};

export default class {
  constructor(id) {
    this.id = id;
    this.positionX = 0;
    this.positionY = 0;
    this.playerElement = null;
    this.canPlaceBomb = true;
    this.placedBombs = [];
    this.currentPower = null;

    this.BombeFrequencyDelay = 1;
    this.bombeRange = 1;
    this.speed = 1;
    this.lives = 3;

    switch (id) {
      case 0:
        this.startingPos = { x: 1, y: 1 };
        this.startingDirection = "right";
        break;
      case 1:
        this.startingPos = { x: 18, y: 1 };
        this.startingDirection = "left";
        break;
      case 2:
        this.startingPos = { x: 1, y: 18 };
        this.startingDirection = "right";
        break;
      case 3:
        this.startingPos = { x: 18, y: 18 };
        this.startingDirection = "left";

      default:
        break;
    }

    this.MoveState = {
      MovingLeft: false,
      MovingRight: false,
      MovingUp: false,
      MovingDown: false,
      NoMoving: true,
      lastDirection: undefined,
    };

    this.noMovingLeftSrc = imagePath + `P${id + 1}-S-L.png`;
    this.movingLeftSrc = imagePath + `P${id + 1}-M-L.gif`;
    this.noMovingRightSrc = imagePath + `P${id + 1}-S-R.png`;
    this.movingRightSrc = imagePath + `P${id + 1}-M-R.gif`;
    this.noMovingUpSrc = imagePath + `P${id + 1}-S-UP.png`;
    this.movingUPSrc = imagePath + `P${id + 1}-M-UP.gif`;
    this.noMovingDownSrc = imagePath + `P${id + 1}-S-D.png`;
    this.movingDownSrc = imagePath + `P${id + 1}-M-D.gif`;

    this.mapNonMovingAction = {
      left: (playerNode) => (playerNode.src = this.noMovingLeftSrc),
      right: (playerNode) => (playerNode.src = this.noMovingRightSrc),
      up: (playerNode) => (playerNode.src = this.noMovingUpSrc),
      down: (playerNode) => (playerNode.src = this.noMovingDownSrc),
    };
  }
  noMoving() {
    return (
      !this.MoveState.MovingRight &&
      !this.MoveState.MovingLeft &&
      !this.MoveState.MovingUp &&
      !this.MoveState.MovingDown
    );
  }

  stopPlaceBombeAbilityForABit() {
    this.canPlaceBomb = false;
    setTimeout(() => (this.canPlaceBomb = true), this.BombeFrequencyDelay);
  }

  decreaseLives() {
    console.log("im touched ");
    this.lives--;
    if (this.lives == 0) {
      const heart = document.createElement("span");
      heart.innerHTML = "&#128128;";
      heart.classList.add("heart");
      this.infosElem.refs.playerLives.innerHTML = "";
      this.infosElem.refs.playerLives.appendChild(heart);
      this.die();
      return;
    }
    document.dispatchEvent(new CustomEvent("live-decreased", { detail: this }));
  }
  die() {
    this.playerElement.remove();
    gameStores.players.amount--;
    if (this.nickname == gameStores.MyNickname) {
      gameStores.gameContainerElement.loadGameMenu("die");
      return;
    }

    if (gameStores.players.amount == 1) {
      gameStores.gameContainerElement.loadGameMenu("win");
    }
  }
  isMe() {
    return this.id == gameStores.myId;
  }
  updatePlayerPosition() {
    /**
     * @type {HTMLElement}
     */
    let playerNode = this.playerElement.refs.player;

    let upDate = () => {
      playerNode.style.left = gameStores.scale(this.positionX);
      playerNode.style.top = gameStores.scale(this.positionY);
    };

    let xr = Math.round(this.positionX);
    let yr = Math.round(this.positionY);
    if (gameStores.isPowerUp1(xr, yr)) {
      gameStores.powerupElements.get(`${xr}-${yr}`).remove();

      let p = gameStores.map[yr][xr];
      gameStores.powerUpHander[p - 3](this);
      gameStores.map[yr][xr] = 0;
      console.log(p - 3, "lolo");
    }

    let xC, yC;
    if (this.MoveState.MovingLeft) {
      this.positionX -= this.speed / 13;
      this.positionX = this.positionX < 1 ? 1 : this.positionX;
      this.positionY = Math.round(this.positionY);
      xC = Math.floor(this.positionX);
      yC = Math.floor(this.positionY);

      if (
        nonDecimal(this.positionY) &&
        gameStores.haveCollision(this.positionY, xC)
      ) {
        this.positionX = this.positionX + this.speed / 13;
      }

      if (
        !nonDecimal(this.positionY) &&
        (gameStores.haveCollision(yC + 1, xC) ||
          gameStores.haveCollision(yC, xC))
      ) {
        this.positionX = this.positionX + this.speed / 13;
      }

      if (this.MoveState.lastDirection != "left")
        playerNode.src = this.movingLeftSrc;

      this.MoveState.lastDirection = "left";
      this.MoveState.NoMoving = false;
      upDate();
      return;
    }

    if (this.MoveState.MovingRight) {
      this.positionX += this.speed / 13;
      this.positionX = this.positionX > 18 ? 18 : this.positionX;
      this.positionY = Math.round(this.positionY);

      yC = Math.ceil(this.positionY);
      xC = Math.ceil(this.positionX);

      if (
        nonDecimal(this.positionY) &&
        gameStores.haveCollision(this.positionY, xC)
      ) {
        this.positionX = this.positionX - this.speed / 13;
      }

      if (
        !nonDecimal(this.positionY) &&
        (gameStores.haveCollision(yC - 1, xC) ||
          gameStores.haveCollision(yC, xC))
      ) {
        this.positionX = this.positionX - this.speed / 13;
      }

      if (this.MoveState.lastDirection != "right")
        playerNode.src = this.movingRightSrc;

      this.MoveState.lastDirection = "right";
      this.MoveState.NoMoving = false;
      upDate();
      return;
    }

    if (this.MoveState.MovingUp) {
      this.positionY -= this.speed / 13;
      this.positionX = Math.round(this.positionX);
      this.positionY = this.positionY < 1 ? 1 : this.positionY;

      yC = Math.floor(this.positionY);
      xC = Math.ceil(this.positionX);

      if (
        nonDecimal(this.positionX) &&
        gameStores.haveCollision(yC, this.positionX)
      ) {
        this.positionY = this.positionY + this.speed / 13;
      }
      if (
        !nonDecimal(this.positionX) &&
        (gameStores.haveCollision(yC, xC) ||
          gameStores.haveCollision(yC, xC - 1))
      ) {
        this.positionY = this.positionY + this.speed / 13;
      }

      if (this.MoveState.lastDirection != "up")
        playerNode.src = this.movingUPSrc;

      this.MoveState.lastDirection = "up";
      this.MoveState.NoMoving = false;
      upDate();
      return;
    }

    // Mouvement vers le bas
    if (this.MoveState.MovingDown) {
      this.positionY += this.speed / 13;
      this.positionX = Math.round(this.positionX);
      this.positionY = this.positionY > 18 ? 18 : this.positionY;

      yC = Math.ceil(this.positionY);
      xC = Math.floor(this.positionX);

      if (
        nonDecimal(this.positionX) &&
        gameStores.haveCollision(yC, this.positionX)
      ) {
        this.positionY = this.positionY - this.speed / 13;
      }
      if (
        !nonDecimal(this.positionX) &&
        (gameStores.haveCollision(yC, xC) ||
          gameStores.haveCollision(yC, xC + 1))
      ) {
        this.positionY = this.positionY - this.speed / 13;
      }

      if (this.MoveState.lastDirection != "down")
        playerNode.src = this.movingDownSrc;

      this.MoveState.lastDirection = "down";
      this.MoveState.NoMoving = false;
      upDate();
      return;
    }

    if (this.noMoving() && !this.MoveState.NoMoving) {
      this.mapNonMovingAction[this.MoveState.lastDirection](playerNode);
      this.MoveState.lastDirection = "";
      this.MoveState.NoMoving = true;
    }
  }

  placeBomb = () => {
    if (this.canPlaceBomb) {
    }
  };

  // canPlaceBomb() {
  //   return this.Bombs.length === 0;
  // }
}
