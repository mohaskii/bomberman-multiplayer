export default {
    template : `
    <div ref="container" style="width:100%" @game-started="hide.global">
    <p id ="loaderStatus" style = "opacity : 1" ref="loaderStatus">Waiting for player ..</p>
    <div class="loader"></div> 
    </div>
    `,
    props : {
        tag: 'loader-template',
    },

    methods: {
        setLoaderStatus(status){
            this.refs.loaderStatus.textContent = status
        },
        hide(){
            this.refs.loaderStatus.remove()
            
        }
    },
    hooks :{
        onConnected(){
            setInterval(()=> this.refs.loaderStatus.classList.toggle("hidde"),3000)
        },
    }

    
}
