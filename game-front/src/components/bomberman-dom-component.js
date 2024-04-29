import websocketStore from "../stores/websocket-store.js"

export default {
    template : `
    <div id=game>
        <game-container></game-container>
        <chat-template ></chat-template>
    </div>`,
    props:{
        app:true,
        tag : 'bomberman-dom'
    },
    hooks : {
        onConnected() {
            websocketStore.establishConnection()
        }
    }
}