import websocketStore from "../stores/websocket-store.js";
import { useKeyListener } from "../utils/useKeyListener.js";


export default {
  template: `
      <div @chat="handleNewMessage.global" class="container">
        <!-- Chat inbox  -->
        <div class="chat-page">
          <div class="msg-inbox">
            <div class="chats">
              <!-- Message container -->
              <div ref= "msgPage" class="msg-page">
 
              
              </div>
            </div>
  
            <!-- msg-bottom section -->
  
            <div class="msg-bottom">
              <div class="input-group">
                <input
                  ref="input"
                  type="text"
                  class="form-control"
                  placeholder="Write message..."
                />
  
                <span class="input-group-text send-icon">
                  <i class="bi bi-send"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
  
  `,
  state: {
    keyListeners: []
  },

  props: {
    tag: "chat-box"
  },
  methods: {
    handleNewMessage(e) {

      const msgView = customElements.get("msg-component")
      this.refs.msgPage.appendChild(new msgView(e.detail))
    },

    addKeyListenerOnInput() {
      this.state.keyListeners.push(useKeyListener({
        target: this.refs.input,
        event: "keyup",
        callbacks: {
          ["Enter"]: this.handleSendMessage,
        }
      }))
    },

    handleSendMessage() {
      const content = this.refs.input.value
      if (content.trim() === "") {
        return
      }
      const message = {
        content
      }
      websocketStore.sendMessage(message)
      this.refs.input.value = ''
    }
  },
  hooks: {
    onConnected() {
      this.addKeyListenerOnInput()
      this.state.keyListeners.forEach(kl => kl.connect());
    },
    onDisconnected() {
      this.state.keyListeners.forEach(kl => kl.disconnect());
    }
  }
}