import gameStores from "../stores/game-stores.js";


export default {
    template: `
    <div id ="menu-header-container"  class="menu-container" >
        <div>
        <h2  ref = "PlayerNickname"></h3>
        <p ref="playerLives"><p>
        </div>
        <div ref="otherPlayersInfos" class="other-plyr-info"></div>
        <loader-template ref="loader"></loader-template> 
    </div>`,
    props: {
        tag: 'menu-header'
    },
    state: {
        currentPlayer: undefined,
        otherPlayers: []
    },
    methods: {

        hideLoader(){
            this.refs.loader.remove()
        }
    },
    hooks: {
        onConnected() {
            this.refs.PlayerNickname.textContent = gameStores.MyNickname
            this.refs.playerLives.textContent = this.state.currentPlayer.lives
            this.state.otherPlayers.forEach(p => {
                const pCardElem = customElements.get('header-card')
                this.refs.otherPlayersInfos.appendChild(new pCardElem(p))
            });
        },
        init() {
            const myId = `player${gameStores.myId + 1}`
            this.state.currentPlayer = gameStores.players[myId]

            this.state.otherPlayers = Object.values(gameStores.players).filter(p => p.onRoom && p.nickname != this.state.currentPlayer.nickname)
    

        }
    }

}
    