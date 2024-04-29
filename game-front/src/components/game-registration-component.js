import gameStores from "../stores/game-stores.js";
import websocketStore from "../stores/websocket-store.js";
import { useKeyListener } from "../utils/useKeyListener.js";

export default {
    state: {
        keyListeners: []
    },
    template:
        `<div id= "game-menu-container" >
                <input ref="input" id="nickNameInput" type="text" placeholder="Enter your Nickname ">
                <div ref = "NicknameErr" class = "errorMsg"></div>
                <div ref = "registrationSuccess" class = "success">you are successfully registered  </div>
            </div>`,
    props: {
        tag: `game-registration-template`
    },
    methods: {
        showError(errMsg) {
            this.refs.NicknameErr.textContent = errMsg;
            this.refs.NicknameErr.style.display = "block"
            setTimeout(() => this.refs.NicknameErr.style.display = "none", 3000);
        },

        success() {
            this.refs.registrationSuccess.style.display = 'block';
            setTimeout(() => {
                this.refs.registrationSuccess.style.display = "none"
                document.dispatchEvent(new CustomEvent("registration-success"))
                this.remove()
            }, 2000)    
        },
        async handleNicknameRegistration() {
            let Nickname = this.refs.input.value

            if (Nickname.trim().length==0 || Nickname.length>10) {
                this.refs.input.value = ""
                this.showError("No valid Nickname")
                return
            }

            let haveWhiteSpace = Nickname.split("").some(v => v.charCodeAt(0) <= " ".charCodeAt(0))
            if (haveWhiteSpace) {
                this.refs.input.value = ""
                this.showError("No valid Nickname")
                return
            }

            let response = await websocketStore.sendRegistrationMessage(Nickname)
            if (response.status !== "success") {
                this.refs.input.value = ""
                this.showError("Nickname already chosen")
                return
            }
            gameStores.MyNickname = Nickname
            this.success()

            this.refs.input.value = ""
        },
        addKeyListenerOnInput() {
            this.state.keyListeners.push(useKeyListener({
                target: this.refs.input,
                event: "keyup",
                callbacks: {
                    ["Enter"]: this.handleNicknameRegistration,
                }
            }))
        }
    },
    hooks: {
        onConnected() {
            this.addKeyListenerOnInput()
            this.refs.NicknameErr.style.display = 'none'
            this.refs.registrationSuccess.style.display = 'none'
            this.state.keyListeners.forEach(kl => kl.connect());
        },
        onDisconnected() {
            this.state.keyListeners.forEach(kl => kl.disconnect());
        }
    }
}

