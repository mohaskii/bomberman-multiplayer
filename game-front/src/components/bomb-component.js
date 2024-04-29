import gameStores from "../stores/game-stores.js";

export default {
  template: `
        <img  class="bomb" src="${gameStores.imagePath}bombe.gif"> 
        
        </img>
    `,
  props: {
    tag: "bomb-component",
  },
  method: {
    reduceTime() {
      this.timer--;
    },
  },
  state: {
    id: undefined,
    timer: 2000,
  },
  hooks: {
    onConnected() {},
    init(bomb) {
      this.timer = 100
      this.coord= bomb.coord;
      this.range  = bomb.range;
      let theTerrorist = gameStores.players[`player${bomb.terroristId+1}`]
      theTerrorist.placedBombs.push(this)

      // bomb = gameStores.setBomb(bomb);
      // this.state.id = bomb.id;
    },
  },
};

