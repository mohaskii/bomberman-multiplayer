export default {
    template: `
    
    <div ref= "msgContainer">
    <div ref="senderInfos"></div>
        <div ref= "contentContainer">
            <div class="received-msg-inbox">
                <p ref= "msgContent">
                    
                </p>

                <span ref= "msgTime" class="time"></span>
            </div>
        </div>
    </div>
    
    `,

    state: {
        message: {}
    },

    props: {
        tag: "msg-component"
    },

    hooks: {
        init(message) {
            this.state.message = message

            if (!message.incomming) {
                this.refs.msgContainer.classList.add("outgoing-chats")
                this.refs.contentContainer.classList.add("outgoing-chats-msg")
                this.style.justifyContent = "flex-end"
                this.style.display = "flex"
                this.style.flexDirection = "row"
                this.refs.senderInfos.remove()
            } else {
                this.refs.msgContainer.classList.add("received-chats")
                this.refs.contentContainer.classList.add("received-msg")
            }
            this.refs.msgContent.textContent = message.content
            this.refs.senderInfos.textContent = message.senderNicKname

            const date = new Date(message.time)
            const month = date.toLocaleString('default', { month: 'long' });
            const formatedTime = `${date.getHours()}h:${date.getMinutes()}mn | ${date.getDay()}-${month}`
            this.refs.msgTime.textContent = formatedTime


        }
    }


}