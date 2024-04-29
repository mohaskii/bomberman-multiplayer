export default {
    template: `<div  id="chat-container">
        <div class = "game-container-background" ref ="background" > </div>
        <chat-box></chat-box>
            
    </div>`,
    state: {
        ws: null
    },
    props: {
        tag: 'chat-template'
    },
    methods: {
        sendSomeMessage(e) {
            e.preventDefault();
        },
    },
    hooks: {
        onConnected() {
            this.refs.background.style.filter = "blur(13px)"
        }
    }
}