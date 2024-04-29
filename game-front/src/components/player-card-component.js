import gameStores from "../stores/game-stores.js";

export default {
    template: `
    <img ref = "playerImgSrc" src="" alt="">
    <div class="playerSubCard" >
        <div ref= "playerNickName" class="playerNickName"></div>
        <div ref="playerId" class="playerId"></div>
    </div>
    `,
    props: {
        tag: `player-card`
    },
    methods: {
        // fillPlayersContainer(PlayersIn){

        // }
    },
    hooks: {
        init(objArg) {
            let player = `player${objArg.id + 1}`

            let playSrc = gameStores.players[player].movingDownSrc

            this.refs.playerNickName.textContent = objArg.nickname
            this.refs.playerImgSrc.src = playSrc
            this.refs.playerId.textContent = player
            this.refs.playerNickName.classList.add(player)
        }
    }


}
