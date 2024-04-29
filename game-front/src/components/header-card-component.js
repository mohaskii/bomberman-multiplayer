export default {
    template: `
        <div ref='header-card' @live-decreased="removeHeart.global">
            <h4 ref="playerName"></h4>
            <p ref="playerLives"></p>
        </div>
    `,
    state: {
        player: undefined
    },
    props: {
        tag: 'header-card'
    },
    methods: {
        removeHeart(e) {
            try {
            const player = e.detail
            const lastChild = this.refs.playerLives.lastChild
            
            player.infosElem.refs.playerLives.removeChild(lastChild)
            } catch (error) {
     
            }
        }
    },
    hooks: {
        init(player) {
            this.state.player = player
        },
        onConnected() {
            this.refs.playerName.textContent = this.state.player.nickname

            for (let index = 0; index < this.state.player.lives; index++) {
                const heart = document.createElement("span")
                heart.innerHTML = '&hearts;'
                heart.classList.add('heart')
                this.refs.playerLives.appendChild(heart)

            }
        }

    }
}