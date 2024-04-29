import gameStores from "../stores/game-stores.js";


export default {
  template: `
    <img class = "explosion" src="${gameStores.imagePath}explosion.gif" alt="">
    `,
  props: {
    tag: "explosion-component",
  },
  hooks: {
    init(objArg) {
      this.style.top = gameStores.scale(objArg.y);
      this.style.left = gameStores.scale(objArg.x);
    },
    onConnected(){
        setTimeout(()=>this.remove(), 450)
    }
  },
};
