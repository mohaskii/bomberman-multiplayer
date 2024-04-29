import gameStores from "../stores/game-stores.js";


export default {
    template: `
    <div id ="menu-header-container" @live-decreased="removeHeart.global"  class="menu-container" >
        <div>
        <h2  ref = "PlayerNickname"></h3>
        <p ref="playerLives"><p>
        </div>
        <div ref="otherPlayersInfos" class="other-plyr-info"></div>
    </div>`,
    props: {
        tag: 'header-ongame'
    },
    state: {
        currentPlayer: undefined,
        otherPlayers: []
    },
    methods: {

        hideLoader(){
            this.refs.loader.remove()
        },
        removeHeart(e){
            const player = e.detail
            const lastChild = this.refs.playerLives.lastChild

            if (player.nickname == this.state.currentPlayer.nickname) {
                this.refs.playerLives.removeChild(lastChild)
            }
        }
    },
    hooks: {
        onConnected() {
            this.refs.PlayerNickname.textContent = gameStores.MyNickname
            for (let index = 0; index < this.state.currentPlayer.lives; index++) {
                const heart = document.createElement("span")
                heart.innerHTML = '&hearts;'
                heart.classList.add('heart')
                this.refs.playerLives.appendChild(heart)
                
                
            }
            this.state.otherPlayers.forEach(p => {
                const pCardElem = customElements.get('header-card')
                const pElem=new pCardElem(p)
                p.infosElem = pElem
                this.refs.otherPlayersInfos.appendChild(pElem)
            });

            const myId = `player${gameStores.myId + 1}`
            gameStores.players[myId].infosElem = this

        },
        init() {
            const myId = `player${gameStores.myId + 1}`
            this.state.currentPlayer = gameStores.players[myId]

            this.state.otherPlayers = Object.values(gameStores.players).filter(p => p.onRoom && p.nickname != this.state.currentPlayer.nickname)
    

        }
    }

}
